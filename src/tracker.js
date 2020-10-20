"use strict"

const dgram = require("dgram")
const Buffer = require("buffer").Buffer
const urlParse = require("url").parse
const crypto = require("crypto")
const torrentParser = require("./torrentParser")
const util = require("./util")

const buildConnReq = () => {
	const buf = Buffer.alloc(16)

	//connection_id = 0x41727101980
	//Ox specifies hexadecimal format
	//there is no method for a 64-bit integers in node
	buf.writeUInt32BE(0x417, 0)
	buf.writeUInt32BE(0x27101980, 4)
	// action
	buf.writeUInt32BE(0, 8) // 4
	// transaction id
	crypto.randomBytes(4).copy(buf, 12) // 5

	return buf
}

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
	// ...
}

function buildConnReq() {
	// ...
}

const parseConnResp = resp => {
	return {
		action: resp.readUInt32BE(0),
		transactionId: resp.readUInt32BE(4),
		connectionId: resp.slice(8),
	}
}

const builtAnnounceReq = (connId, torrent, port = 6881) => {
	const buf = Buffer.allocUnsafe(98)

	// connection id
	connId.copy(buf, 0)
	// action
	buf.writeUInt32BE(1, 8)
	// transaction id
	crypto.randomBytes(4).copy(buf, 12)
	// info hash
	torrentParser.infoHash(torrent).copy(buf, 16)
	// peerId
	util.genId().copy(buf, 36)
	// downloaded
	Buffer.alloc(8).copy(buf, 56)
	// left
	torrentParser.size(torrent).copy(buf, 64)
	// uploaded
	Buffer.alloc(8).copy(buf, 72)
	// event
	buf.writeUInt32BE(0, 80)
	// ip address
	buf.writeUInt32BE(0, 80)
	// key
	crypto.randomBytes(4).copy(buf, 88)
	// num want
	buf.writeInt32BE(-1, 92)
	// port
	buf.writeUInt16BE(port, 96)

	return buf
}

function parseAnnounceResp(resp) {
	// ...
}

//The only way to send a message in a socket is through a buffer
const message = Buffer.from("hello", utf8)
