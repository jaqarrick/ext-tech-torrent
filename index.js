"use strict"
const download = require("./src/download")

const fs = require("fs")
const bencode = require("bencode")
const tracker = require("./src/tracker/tracker")
const torrentParser = require("./src/torrent-parser")

const torrent = torrentParser.open("./data/dn2020-1026.mp4.torrent")
tracker.getPeers(torrent, peers => {
	console.log("list of peers: ", peers)
})

// download(torrent)
