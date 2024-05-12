/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createServer } from "http";
import type { IClientOptions, MqttClient } from "mqtt";
import { connect } from "mqtt";
import { Server } from "socket.io";

// WebSocket connection
const port = 4000;

const httpServer = createServer();

httpServer
  .once("[HTTP] ", (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`[HTTP] > Ready on port:${port}`);
  });

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) =>
  console.log(`[WEBSOCKET] > client ${socket.id} connected in websocket`),
);

io.on("disconnect", (socket) =>
  console.log(`[WEBSOCKET] > client ${socket.id} disconnected in websocket`),
);

// MQTT connection
const options: IClientOptions = {
  protocol: "mqtt",
  host: "unibus_broker",
  port: 1883,
  username: "anonymous",
  password: "anonymous",
};

const clientMQTT: MqttClient = connect(options);

const plates = [
  {
    plate: "BRA2E19",
  },
];

clientMQTT.on("connect", () => {
  for (const plate of plates) {
    clientMQTT.subscribe(plate.plate, (err: Error | null) => {
      if (!err)
        console.log(
          `[MQTT] > client subscribe ${clientMQTT.options.clientId} subscribed to ${plate.plate} topic`,
        );
      else {
        console.log(`[MQTT] > client subscribe erro`, err);
      }
    });
  }
  clientMQTT.on("message", (topic: string, message: Buffer) => {
    console.log(`[MQTT] > ${topic} recebeu ${message.toString()}`);
    io.emit("positionBus", {
      plate: topic,
      position: parseCoordinates(message.toString()),
    });
    console.log(
      `[WEBSOCKET] > postition ${message.toString()} of plate ${topic} updated`,
    );
  });
});

clientMQTT.on("error", (error) => console.log("[MQTT] client error ", error));

function parseCoordinates(coordinatesString: string) {
  const [latStr, longStr] = coordinatesString.split(",");
  const lat = parseFloat(`${latStr}`);
  const long = parseFloat(`${longStr}`);

  return {
    lat,
    long,
  };
}
