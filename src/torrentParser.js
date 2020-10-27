"use strict"

const fs = require("fs")
const bencode = require("bencode")
const bignum = require("bignum")
const crypto = require("crypto")

module.exports.open = filepath => bencode.decode(fs.readFileSync(filepath))

module.exports.size = torrent => {
	//a torrent can contain one file or multiple files
	const size = torrent.info.files
		? //first we have to check if are multiple files
		  //if there are we iterate over each to get the length of each file
		  //add them together with reduce
		  torrent.info.files.map(file => file.length).reduce((a, b) => a + b)
		: //if there is one file, we simply pull the length property from the info object
		  torrent.info.length

	//function returns a number in the form of an 8byte buffer
	return bignum.toBuffer(size, { size: 8 })
}

module.exports.infoHash = torrent => {
	//the torrent metadata contains an info object
	const info = bencode.encode(torrent.info)
	//SHA1 is the hashing function used by bitTorrent, but it is one of many functions
	//This is a unique way of identifying the specific torrent
	return crypto.createHash("sha1").update(info).digest()
}
