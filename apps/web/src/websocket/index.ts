"use client";

import { io } from "socket.io-client";

export const socket = io("https://websocket.unibus.fbi.com");
