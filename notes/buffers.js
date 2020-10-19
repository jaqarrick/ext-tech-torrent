const Buffer = require("buffer").Buffer

const newBuffer = Buffer.from([
	0x68,
	0x65,
	0x6c,
	0x6c,
	0x6f,
	0x20,
	0x77,
	0x6f,
	0x72,
	0x6c,
	0x64,
])

console.log(newBuffer)
//returns <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

console.log(newBuffer.toString("utf8"))
//returns 'hello world'

const message = "hello world"
stringBuffer = Buffer.from(message, "utf8")
console.log(stringBuffer)
// returns <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

//bit question - how are floats and doubles processed

// create an empty buffer with length of 4 bytes.
const buf = Buffer.alloc(4)

// write the unsigned 32-bit, big-endian number 123 into the buffer starting
// at index 0 of the buffer.
buf.writeUInt32BE(123, 0)

// read the number starting at index 0
console.log(buf.readUInt32BE(0))
// outputs: 123
