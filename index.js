const { SerialPort } = require("serialport");
const {
  MavLinkPacketSplitter,
  MavLinkPacketParser,
  minimal,
  common,
  ardupilotmega,
  MavLinkProtocolV2,
  send,
} = require("node-mavlink");

// substitute with your serial port!
const port = new SerialPort({
  path: "/dev/tty.usbserial-D30EZNZF",
  baudRate: 57600,
});

// constructing a reader that will emit each packet separately
const reader = port
  .pipe(new MavLinkPacketSplitter())
  .pipe(new MavLinkPacketParser());

// create a registry of mappings between a message id and a data class
const REGISTRY = {
  ...minimal.REGISTRY,
  ...common.REGISTRY,
  ...ardupilotmega.REGISTRY,
};

reader.on("data", (packet) => {
  const clazz = REGISTRY[packet.header.msgid];
  if (clazz) {
    const data = packet.protocol.data(packet.payload, clazz);

    console.log(data.constructor.name);
    if (data.constructor.name == "CommandAck")
      console.log("Received packet: CommandAck", data);

    if (data.constructor.name == "ParamValue")
      console.log("Received packet: ParamValue", data);
    if (data.constructor.name == "MissionAck")
      console.log("Received packet: MissionAck", data);
    // if (data.constructor.name == "SysStatus")
    //   console.log("Received packet: Battery", data.batteryRemaining);
    // if (data.constructor.name == "GlobalPositionInt")
    //   console.log(
    //     "Received packet:",
    //     data.lat / 1e7,
    //     data.lon / 1e7,
    //     data.alt / 1000
    //   );
  }
});

const command = new common.RequestProtocolVersionCommand();

const message = new common.MissionClearAll();
message.targetSystem = 1;
message.targetComponent = 1;
message.mission_type = 0;

port.on("open", async () => {
  // let res1 = await send(port, command, new MavLinkProtocolV2());
  // console.log("send1 successfully", res1);
  let res2 = await send(port, message);
  console.log("send2 successfully", res2);
});
