"use client";

import { io } from "socket.io-client";

export const socket = io(
  `https://websocket.${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
);
