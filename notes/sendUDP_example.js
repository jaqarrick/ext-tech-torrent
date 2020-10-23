const fs = require("fs")
const bencode = require("bencode")
const path = require("path")
const dgram = require("dgram")
const Buffer = require("buffer").Buffer
const urlParse = require("url").parse

// const file = fs.readFileSync("message.txt", "utf8")
const torrent = bencode.decode(
	fs.readFileSync(path.resolve(__dirname, "drone.torrent"))
)
const url = urlParse(torrent.announce.toString("utf8"))

console.log(url)
const socket = dgram.createSocket("udp4")

const myMsg = Buffer.from("hello?", "utf8")

socket.send(myMsg, 0, myMsg.length, url.port, url.host, () => {})

socket.on("message", msg => {
	console.log(msg)
})
