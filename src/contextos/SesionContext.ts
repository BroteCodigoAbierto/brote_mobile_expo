import { createContext } from "react";
import type { CuerpoCrearCuenta, CuerpoEntrar, Usuario } from "../tipos/contrato";

// Estado global de la sesión (decisión 0011). Lo llena SesionProvider y se lee
// con useSesion(). A diferencia de la web no hay "sin servidor": sin respuesta
// de la API se entra con el usuario guardado (spec F01, sin conexión).

export type EstadoSesion = {
  estado: "cargando" | "conSesion" | "sinSesion";
  usuario: Usuario | null;
  // aviso que "Entrar" muestra cuando la sesión venció
  aviso: "sesionTerminada" | null;
};

export type ValorSesion = EstadoSesion & {
  crearCuenta: (cuerpo: CuerpoCrearCuenta) => Promise<void>;
  entrar: (cuerpo: CuerpoEntrar) => Promise<void>;
  cerrarSesion: () => void;
};

export const SesionContext = createContext<ValorSesion | null>(null);
