/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-return */

"use client";

import type { LatLngTuple } from "leaflet";
import type { Dispatch } from "react";
import React, { useEffect } from "react";
import { socket } from "@/websocket";

interface positionBus {
  plate: string;
  coordinates: LatLngTuple;
}

interface StateType {
  positions: positionBus[];
  isConnected: boolean;
  transport: string;
}

interface ActionType {
  type: string;
  value: any;
}

const initialState: StateType = {
  positions: [],
  isConnected: false,
  transport: "N/A",
};

export const BusMapContext = React.createContext<{
  state: StateType;
  dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "UPDATE_LOCATION": {
      const { plate, coordinates } = action.value as positionBus;
      const existingIndex = state.positions.findIndex(
        (position) => position.plate === plate,
      );

      if (existingIndex !== -1) {
        const updatedPositions = [...state.positions];
        updatedPositions[existingIndex] = { plate, coordinates };
        return { ...state, positions: updatedPositions };
      } else {
        return {
          ...state,
          positions: [...state.positions, { plate, coordinates }],
        };
      }
    }
    case "SET_CONNECTED": {
      return { ...state, isConnected: action.value };
    }
    case "SET_TRANSPORT": {
      return { ...state, transport: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export function BusMapControllerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    function onConnect() {
      dispatch({ type: "SET_CONNECTED", value: true });
      dispatch({
        type: "SET_TRANSPORT",
        value: socket.io.engine.transport.name,
      });

      socket.io.engine.on("upgrade", (transport) => {
        dispatch({ type: "SET_TRANSPORT", value: transport.name });
      });
    }

    function onDisconnect() {
      dispatch({ type: "SET_CONNECTED", value: false });
      dispatch({ type: "SET_TRANSPORT", value: "N/A" });
    }

    function positionBus(data: {
      plate: string;
      position: { lat: number; long: number };
    }) {
      dispatch({
        type: "UPDATE_LOCATION",
        value: {
          plate: data.plate,
          coordinates: [data.position.lat, data.position.long],
        },
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("positionBus", positionBus);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("positionBus", positionBus);
    };
  }, []);

  return (
    <BusMapContext.Provider value={{ state, dispatch }}>
      {children}
    </BusMapContext.Provider>
  );
}

export function useBusMapController() {
  const context = React.useContext(BusMapContext);

  if (!context) {
    throw new Error(
      "useBusMapController should be used inside the BusMapControllerProvider.",
    );
  } else return context;
}

export const updateLocation = (
  dispatch: (arg0: { type: string; value: positionBus }) => any,
  value: positionBus,
) => dispatch({ type: "UPDATE_LOCATION", value });
