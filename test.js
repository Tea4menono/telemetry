const { SerialPort } = require("serialport");
const port = new SerialPort({
  path: "/dev/tty.usbserial-D30EZNZF",
  baudRate: 57600,
});
