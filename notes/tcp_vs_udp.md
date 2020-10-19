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
