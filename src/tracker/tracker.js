"use strict"

const dgram = require("dgram")
const Buffer = require("buffer").Buffer
const urlParse = require("url").parse
const crypto = require("crypto")
const torrentParser = require("./torrentParser")
const util = require("./tracker_util/util")
const buildConnReq = require("./tracker_util/buildConnReq")
const parseConnResp = require("./tracker_util/parseConnResp")
const buildAnnounceReq = require("./tracker_util/buildAnnounceReq")

//UDP Tracker Protocol and Message Format
//Trackers follow a specific protocol and message format
//In order to get a list of peers, we need to follow this protocol.
//1. Send a connect request
//2. Get the connect response and extract connection id
//3. Use the connection id to send an announce request - this is where we tell
//the tracker which files we're interested in
//4. Get the announce response and extract the peers list

module.exports.getPeers = (torrent, callback) => {
	//dgram is a module for udp.
	//socket instance is a means for network communication.
	//argument 'udp4' means we want to use 4-byte IPv4 address (this is the most commonly used)
	const socket = dgram.createSocket("udp4")
	//Extract url parts (protocol, hostname, port, etc)
	const url = urlParse(torrent.announce.toString("utf8"))

	// 1. send connect request
	//This is a convenience function, exctracted from socket.send. It excludes the offset and length arguments, since we are sending the whole buffer.
	udpSend(socket, buildConnReq(), url)

	socket.on("message", response => {
		//there will be two responses upon the request: a connect and an announce response. We need to distinguish between the two and process them separately.
		if (respType(response) === "connect") {
			const connResp = parseConnResp(response)
			const announceReq = buildAnnounceReq(connResp.connectionId, torrent)
			udpSend(socket, announceReq, url)
		} else if (respType(response) === "announce") {
			const announceResp = parseAnnounceResp(response)
			callback(announceResp.peers)
		}
	})
}

const udpSend = (socket, message, rawUrl, callback = () => {}) => {
	const url = urlParse(rawUrl)
	socket.send(message, 0, message.length, url.port, url.host, callback)
}

function respType(resp) {
	const action = resp.readUInt32BE(0)
	if (action === 0) return "connect"
	if (action === 1) return "announce"
}

const parseAnnounceResp = resp => {
	function group(iterable, groupSize) {
		let groups = []
		for (let i = 0; i < iterable.length; i += groupSize) {
			groups.push(iterable.slice(i, i + groupSize))
		}
		return groups
	}

	return {
		action: resp.readUInt32BE(0),
		transactionId: resp.readUInt32BE(4),
		leechers: resp.readUInt32BE(8),
		seeders: resp.readUInt32BE(12),
		peers: group(resp.slice(20), 6).map(address => {
			return {
				ip: address.slice(0, 4).join("."),
				port: address.readUInt16BE(4),
			}
		}),
	}
}
