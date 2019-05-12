var protocol = require('./sensor-protocol');
var dgram = require('dgram');
var s = dgram.createSocket('udp4');
var uuid = require('uuid');
const INSTRUMENTS = new Map([
    ['piano', 'ti-ta-ti'],
    ['trumpet', 'pouet'],
    ['flute', 'trulu'],
    ['violin', 'gzi-gzi'],
    ['drum', 'boum-boum'],
]);

function Musician(instrument) {
	
    this.id = uuid();
    this.sound = INSTRUMENTS.get(instrument);
	this.activeSince = Date.now();

    Musician.prototype.update = function() {
        var measure = {
            uuid: this.id,
            sound: this.sound,
            activeSince: this.activeSince,
        };
        var payload = JSON.stringify(measure);

        var message = Buffer.from(payload);
        s.send(message, 0, message.length, protocol.PROTOCOL_PORT,
               protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
            console.log("Sending payload : " + payload + " via port : " + s.address().port);
        });
    };

    setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];
var musician = new Musician(instrument);