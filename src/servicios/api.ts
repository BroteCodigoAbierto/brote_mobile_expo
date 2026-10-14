import { URL_API } from "../config";

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

export async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(URL_API + ruta, {
    ...opciones,
    headers: { "Content-Type": "application/json", ...opciones.headers },
  });
  if (!respuesta.ok) {
    // el cuerpo puede no ser JSON (p. ej. un proxy caído)
    const cuerpo = await respuesta.json().catch(() => null);
    throw new ErrorHttp(respuesta.status, cuerpo);
  }
  return respuesta.json() as Promise<T>;
}
