"use strict"
const fs = require("fs")

//Bencode is data serialization format. Is able to decode torrent data.
const bencode = require("bencode")
const tracker = require("./src/tracker")
const torrent = bencode.decode(fs.readFileSync("./data/drone.torrent"))

tracker.getPeers(torrent, peers => {
	console.log("list of peers", peers)
})
