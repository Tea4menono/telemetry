import { SerialPort } from "serialport";
import {
  MavLinkPacketSplitter,
  MavLinkPacketParser,
  MavLinkPacketRegistry,
  minimal,
  common,
  ardupilotmega,
  MavLinkProtocolV2,
  send,
} from "node-mavlink";

// substitute /dev/ttyACM0 with your serial port!
const port = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 57600 });

// constructing a reader that will emit each packet separately
const reader = port
  .pipe(new MavLinkPacketSplitter())
  .pipe(new MavLinkPacketParser());

// create a registry of mappings between a message id and a data class
const REGISTRY: MavLinkPacketRegistry = {
  ...minimal.REGISTRY,
  ...common.REGISTRY,
  ...ardupilotmega.REGISTRY,
};

reader.on("data", (packet) => {
  const clazz = REGISTRY[packet.header.msgid];
  if (clazz) {
    const data = packet.protocol.data(packet.payload, clazz);
    console.log("Received packet:", data);
  }
});

const command = new common.RequestProtocolVersionCommand();
command.confirmation = 1;

port.on("open", async () => {
  // the port is open - we're ready to send data
  await send(port, command, new MavLinkProtocolV2());
});
