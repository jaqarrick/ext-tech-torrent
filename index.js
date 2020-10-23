"use strict"
const download = require("./src/download")

const fs = require("fs")
const bencode = require("bencode")
const tracker = require("./tracker")
const torrentParser = require("./torrent-parser")

const torrent = torrentParser.open("puppy.torrent")

tracker.getPeers(torrent, peers => {
	console.log("list of peers: ", peers)
})

download(torrent)
