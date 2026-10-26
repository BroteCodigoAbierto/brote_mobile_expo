import * as Network from "expo-network";
import { URL_API } from "../config";
import { CABECERA_CLIENTE, CABECERA_TOKEN } from "../tipos/contrato";
import { guardarToken } from "./almacenSesion";

// Único punto de salida a la red. Las funciones de cada recurso
// (servicios/cursos.ts, ...) se construyen encima de pedir().

export class ErrorHttp extends Error {
  estado: number;
  cuerpo: unknown;

  constructor(estado: number, cuerpo: unknown) {
    super(`HTTP ${estado}`);
    this.estado = estado;
    this.cuerpo = cuerpo;
  }
}

// La petición no llegó a la API. La spec distingue dos casos: el teléfono sin
// conexión, o con conexión pero con el servidor caído o inalcanzable.
export class ErrorConexion extends Error {
  sinConexion: boolean;

  constructor(sinConexion: boolean) {
    super(sinConexion ? "Sin conexión" : "No se pudo conectar con la API");
    this.sinConexion = sinConexion;
  }
}

// Sin respuesta en este tiempo se trata como servidor caído; si no, una IP
// inalcanzable dejaría el botón en "Enviando..." más de un minuto.
const ESPERA_MAXIMA_MS = 15_000;

// Token Bearer de la sesión, en memoria; lo carga el SesionProvider al arrancar
// y se guarda solo cuando la API manda uno nuevo.
let token: string | null = null;

export function fijarToken(nuevo: string | null) {
  token = nuevo;
}

export function tokenActual(): string | null {
  return token;
}

let oyentePerderSesion: (() => void) | null = null;

// El SesionProvider se registra aquí para enterarse de cualquier 401.
export function alPerderSesion(oyente: (() => void) | null) {
  oyentePerderSesion = oyente;
}

// En POST /sesiones un 401 significa "correo o contraseña incorrectos", no que
// se haya perdido una sesión.
function esEntrar(ruta: string, opciones: RequestInit): boolean {
  return ruta === "/sesiones" && opciones.method === "POST";
}

async function hayConexion(): Promise<boolean> {
  try {
    // https://docs.expo.dev/versions/v58.0.0/sdk/network/
    const estado = await Network.getNetworkStateAsync();
    return estado.isConnected !== false && estado.isInternetReachable !== false;
  } catch {
    return true; // sin saberlo, mejor no culpar a la conexión del teléfono
  }
}

export async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), ESPERA_MAXIMA_MS);
  let respuesta: Response;
  try {
    respuesta = await fetch(URL_API + ruta, {
      ...opciones,
      signal: control.signal,
      headers: {
        "Content-Type": "application/json",
        // el móvil recibe la sesión como token y no como cookie (F01)
        [CABECERA_CLIENTE.nombre]: CABECERA_CLIENTE.movil,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new ErrorConexion(!(await hayConexion()));
  } finally {
    clearTimeout(temporizador);
  }

  // al entrar o crear la cuenta la API manda el token de la sesión nueva
  const nuevoToken = respuesta.headers.get(CABECERA_TOKEN);
  if (nuevoToken) {
    token = nuevoToken;
    await guardarToken(nuevoToken);
  }

  if (!respuesta.ok) {
    // el cuerpo puede no ser JSON (p. ej. un proxy caído)
    const cuerpo = await respuesta.json().catch(() => null);
    if (respuesta.status === 401 && !esEntrar(ruta, opciones)) oyentePerderSesion?.();
    throw new ErrorHttp(respuesta.status, cuerpo);
  }
  if (respuesta.status === 204) return undefined as T; // sin cuerpo
  return respuesta.json() as Promise<T>;
}
