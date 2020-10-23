"use strict"

const crypto = require("crypto")

let id = null

module.exports.genId = () => {
	if (!id) {
		id = crypto.randomBytes(20)
		//Here is where the Peerid of the bitTorrent client is generated
		//ET for ext-torrent, 0001 for version no.
		Buffer.from("-ET0001-").copy(id, 0)
	}
	return id
}
