# Http vs udp vs tcp

TCP guarantees that when a user sends data, the other user will recieve that data in its entirety and in the correct order.

### UDP

- Acts as a set of rules that specify how data is exchagned over the internet.
- Encapsulates data in a UDP packet, which contains the UDP Header and the UDP Data
  - UDP Header includes a source port, destination port, UDP Length, Checksum
- The UDP packet is then sent in an IP Packet, which has its own set of headers, including _Source Address, Destination Address, Total Length, Time to Live, Identification_, among others.
- These messages are called datagrams
- Connectionless protocol
- Provides port numbers and a checksum capability, not provided by TCP
- If the destination doesn't recieve data, the data is requested again.

### TCP

- TCP sends indivudual data packets
- A connection oriented protocol

#### How TCP works with bitTorrent

- a TCP connection is established between a 'leecher' and a peer seeder.
- Once established, client lets peer know which file it wants. If the peer doesn't have the file the connection is closed. If they do, they send back a similar message - called a "handshake".
- Next, the peer likely sends 'have' and 'bitfield' messages that let the client know what pieces it has. Each _'have'_ message contains a piece index in payload. The _bitfield_ message contains a string of pits, one for each piece in the file.

#### Handshake

````

handshake: <pstrlen><pstr><reserved><info_hash><peer_id>

pstrlen: string length of <pstr>, as a single raw byte
pstr: string identifier of the protocol
reserved: eight (8) reserved bytes. All current implementations use all zeroes.
peer_id: 20-byte string used as a unique ID for the client.

In version 1.0 of the BitTorrent protocol, pstrlen = 19, and pstr = "BitTorrent protocol". ```
````
