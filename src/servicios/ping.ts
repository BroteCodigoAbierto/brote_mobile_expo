import { pedir } from "./api";

export type Ping = { respuesta: "pong" };

export function traerPing() {
  return pedir<Ping>("/ping");
}
