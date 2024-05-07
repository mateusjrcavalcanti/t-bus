import type { IClientOptions, MqttClient } from "mqtt";
import { connect } from "mqtt";

// Função para converter graus para radianos
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Função para converter radianos para graus
function rad2deg(rad: number) {
  return rad * (180 / Math.PI);
}

function move(
  lat = -22.9068,
  long = -43.1729,
  altitude = 0,
  distanciaVertical = 0,
  distanciaHorizontal = 0,
  distanciaAltitude = 0,
) {
  const raioTerra = 6371000;

  const latRad = deg2rad(lat);
  const longRad = deg2rad(long);

  const novaLatRad = latRad - distanciaVertical / raioTerra;

  const novaLongRad =
    longRad + distanciaHorizontal / (raioTerra * Math.cos(latRad));

  const novaAltitude = altitude + distanciaAltitude;

  const novaLat = rad2deg(novaLatRad);
  const novaLong = rad2deg(novaLongRad);

  return {
    lat: novaLat,
    long: novaLong,
    altitude: novaAltitude,
  };
}

const qtdMetros = 10;
let metros = 0;

const options: IClientOptions = {
  protocol: "mqtt",
  // host: "unibus.tech",
  host: process.env.DOMAIN_NAME,
  port: 1883,
  username: "BRA2E19",
  password: "12345678",
};

const clientMQTT: MqttClient = connect(options);

clientMQTT.on("connect", () => {
  clientMQTT.subscribe(`${clientMQTT.options.username}`, (err) => {
    if (!err) {
      console.log(
        `[TEST MQTT] > client subscribe ${clientMQTT.options.username} subscribed to topic`,
      );
      const interval = setInterval(() => {
        metros = metros + qtdMetros;
        const position = move(
          -9.390472517435533,
          -40.49732535541828,
          0,
          0,
          metros,
          0,
        );
        clientMQTT.publish(
          `${clientMQTT.options.username}`,
          `${position.lat},${position.long}`,
        );
      }, 1000);
      clientMQTT.on("close", () => {
        clearInterval(interval);
        console.log(
          `[TEST MQTT] > client ${clientMQTT.options.username} disconnected`,
        );
      });
    } else {
      console.log(`[TEST MQTT] > subscribe erro`, err);
    }
  });

  clientMQTT.on("message", (topic, message) => {
    console.log(`[TEST MQTT] > ${topic} recebeu ${message.toString()}`);
  });
});

clientMQTT.on("error", (error) => console.log("[TEST MQTT] error ", error));
