const protocol = require('./sensor-protocol');
const dgram = require('dgram');
const s = dgram.createSocket('udp4');
const net = require('net');
const SOUNDS = new Map([
    ['ti-ta-ti', 'piano'],
    ['pouet', 'trumpet'],
    ['trulu', 'flute'],
    ['gzi-gzi', 'violin'],
    ['boum-boum', 'drum'],
]);
const MAX_DELAY = 5000;
var musicians = [];

s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


s.on('message', function(msg, source) {
	
	console.log("Data has arrived : " + msg + ". Source port : " + source.port);
    var parsedMsg = JSON.parse(msg);
	
	var uuid = parsedMsg.uuid;
	var instrument = SOUNDS.get(parsedMsg.sound);
	var activeSince = parsedMsg.activeSince;

	musicians.push({
		uuid: uuid,
		instrument: instrument,
		activeSince: activeSince,
	});
	
});

const server = net.createServer(function(socket) {
    var activeMusicians = [];
    for (var i = 0; i < musicians.length; i++) {

        var lastTimeActive = new Date(musicians[i].activeSince);
        if (Date.now().getTime() - lastTimeActive.getTime() <= MAX_DELAY) {
            activeMusicians.push({
                uuid: musicians[i].uuid,
                instrument: musicians[i].instrument,
                activeSince: lastTimeActive.toISOString(),
            });
        }
    }
    var payload = JSON.stringify(activeMusicians);

    socket.write(payload);
    socket.pipe(socket);
    socket.end();
});
server.listen(2205);