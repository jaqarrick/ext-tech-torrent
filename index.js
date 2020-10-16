"use strict"
const fs = require("fs")
const torrent = fs.readFileSync("drone.torrent")
console.log(torrent.toString("utf8"))
