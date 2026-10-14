import { pedir } from "./api";

export type Salud = { estado: "ok" };

export function traerSalud() {
  return pedir<Salud>("/salud");
}
