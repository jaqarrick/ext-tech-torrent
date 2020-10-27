const crypto = require("crypto")
const Buffer = require("buffer").Buffer

const buildConnReq = () => {
	//creates a blank 16 byte buffer
	const buf = Buffer.alloc(16)

	//write the connection id (0x41727101980) in two 32 bits
	//node can't write 64 bits at a time
	buf.writeUInt32BE(0x417, 0)
	buf.writeUInt32BE(0x27101980, 4)

	//write the action - 0 means connect
	buf.writeUInt32BE(0, 8)

	//assign a random transation_id
	crypto.randomBytes(4).copy(buf, 12)

	//should return something like

	// <Buffer 00 00 04 17 27 10 19 80 00 00 00 00 70 fc 85 0d>
	return buf
}

console.log(buildConnReq())

module.exports = buildConnReq
