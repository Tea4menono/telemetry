const SerialPort = require("serialport");
const mavlink = require("mavlink");

// Create a new MAVLink instance
let mav = new mavlink(1, 1); // system and component IDs

// Open the serial port
let port = new SerialPort("/dev/ttyUSB0", {
  baudRate: 57600,
});

// Add an event listener for the 'data' event
port.on("data", function (data) {
  // Parse the incoming data as MAVLink messages
  mav.parse(data);
});

// Add an event listener for the 'message' event
mav.on("message", function (message) {
  // Handle the MAVLink message
  console.log(message);
});
