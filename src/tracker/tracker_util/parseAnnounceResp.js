//the announce response will contain, amoung other information, a list of IP addresses
//so the announce is not a fixed length, so we must parse dynamically
module.exports.parseAnnounceResp = resp => {
	//here is the dynamic parsing
	const group = (iterable, groupSize) => {
		let groups = []
		for (let i = 0; i < iterable.length; i += groupSize) {
			groups.push(iterable.slice(i, i + groupSize))
		}
		return groups
	}

	return {
		//this should be 1 for announce
		action: resp.readUInt32BE(0),

		//transactioon id
		transactionId: resp.readUInt32BE(4),

		//where is 'interval'?

		//leechers
		leechers: resp.readUInt32BE(8),

		//seeders
		seeders: resp.readUInt32BE(12),

		//peers object with ips and ports
		peers: group(resp.slice(20), 6).map(address => {
			return {
				ip: address.slice(0, 4).join("."),
				port: address.readUInt16BE(4),
			}
		}),
	}
}
