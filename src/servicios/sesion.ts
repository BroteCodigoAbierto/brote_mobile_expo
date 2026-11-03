import type {
  CuerpoCrearCuenta,
  CuerpoEntrar,
  RespuestaError,
  RespuestaUsuario,
} from "../tipos/contrato";
import { ErrorConexion, ErrorHttp, MENSAJE_SIN_CONEXION, MENSAJE_SIN_SERVIDOR, pedir } from "./api";

export function crearCuenta(cuerpo: CuerpoCrearCuenta) {
  return pedir<RespuestaUsuario>("/cuentas", { method: "POST", body: JSON.stringify(cuerpo) });
}

export function entrar(cuerpo: CuerpoEntrar) {
  return pedir<RespuestaUsuario>("/sesiones", { method: "POST", body: JSON.stringify(cuerpo) });
}

// Recibe el token porque se llama después de borrar la sesión del dispositivo.
export function cerrarSesion(token: string | null) {
  return pedir<void>("/sesiones/actual", {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function traerYo() {
  return pedir<RespuestaUsuario>("/usuarios/yo");
}

export type ErrorDeEnvio = { general?: string; campos?: Record<string, string> };

// Convierte lo que lanzó un envío en lo que muestra el formulario: errores
// junto a cada campo o un mensaje general arriba.
export function leerErrorDeEnvio(error: unknown): ErrorDeEnvio {
  if (error instanceof ErrorHttp && error.estado < 500) {
    const cuerpo = error.cuerpo as Partial<RespuestaError> | null;
    if (cuerpo?.campos && Object.keys(cuerpo.campos).length > 0) return { campos: cuerpo.campos };
    if (cuerpo?.error) return { general: cuerpo.error };
  }
  if (error instanceof ErrorConexion && error.sinConexion) return { general: MENSAJE_SIN_CONEXION };
  return { general: MENSAJE_SIN_SERVIDOR };
}
