"use strict"

const net = require("net")
const Buffer = require("buffer").Buffer
const tracker = require("../tracker/tracker")

module.exports = torrent => {
	tracker.getPeers(torrent, peers => {
		peers.forEach(download)
	})
}

//downloading from peers
//1. Create a TCP connection with all of the peers in list.
//the more peers the better!
//2. After exchanging messages with the peer to setup, you should start requesting
//pieces of the files you want.
//3. There are likely more pieces than peers,
//so once we recieve a piece from a peer, we want to request the next piece. Ideally we want all
//connections to be requesting different and new pieces so we need to keep track of
//which pieces you already have and which ones you still need
//4. Once we finish download we can write file to hard drive

//5. Set up seeding

const onWhileMsg = (socket, callback) => {
	let savedBuf = Buffer.alloc(0)
	let handshake = true

	socket.on("data")
}

function download(peer) {
	const socket = net.Socket()
	socket.on("error", console.log)
	socket.connect(peer.port, peer.ip, () => {
		// socket.write(...) write a message here
	})
	socket.on("data", recvBuf => {
		// msgLen calculates the length of a whole message
		const msgLen = () =>
			handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4
		savedBuf = Buffer.concat([savedBuf, recvBuf])

		while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
			callback(savedBuf.slice(0, msgLen()))
			savedBuf = savedBuf.slice(msgLen())
			handshake = false
		}
	})
}

// 2
function msgHandler(msg, socket) {
	if (isHandshake(msg)) socket.write(message.buildInterested())
}

// 3
function isHandshake(msg) {
	return (
		msg.length === msg.readUInt8(0) + 49 &&
		msg.toString("utf8", 1) === "BitTorrent protocol"
	)
}
