import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { ErrorHttp, alPerderSesion, fijarToken, tokenActual } from "../servicios/api";
import {
  borrarSesionGuardada,
  guardarUsuario,
  leerToken,
  leerUsuario,
} from "../servicios/almacenSesion";
import * as servicio from "../servicios/sesion";
import type { CuerpoCrearCuenta, CuerpoEntrar, Usuario } from "../tipos/contrato";
import { SesionContext, type EstadoSesion } from "./SesionContext";

type Accion =
  | { tipo: "iniciada"; usuario: Usuario }
  | { tipo: "terminada"; aviso: EstadoSesion["aviso"] }
  | { tipo: "perdida" }
  | { tipo: "cerrada" };

const inicial: EstadoSesion = { estado: "cargando", usuario: null, aviso: null };

function reducir(actual: EstadoSesion, accion: Accion): EstadoSesion {
  switch (accion.tipo) {
    case "iniciada":
      return { estado: "conSesion", usuario: accion.usuario, aviso: null };
    case "terminada":
      return { estado: "sinSesion", usuario: null, aviso: accion.aviso };
    case "perdida":
      if (actual.estado !== "conSesion") return actual;
      return { estado: "sinSesion", usuario: null, aviso: "sesionTerminada" };
    case "cerrada":
      return { estado: "sinSesion", usuario: null, aviso: null };
  }
}

// Al abrir la app. No borra nada: si la sesión venció, lo hace el efecto con
// la respuesta vigente (si se arrancara dos veces, la segunda vuelta ya no
// encontraría el token y no mostraría el aviso).
async function arrancar(): Promise<Accion> {
  const token = await leerToken();
  if (!token) return { tipo: "terminada", aviso: null };
  fijarToken(token);
  try {
    const { usuario } = await servicio.traerYo();
    await guardarUsuario(usuario).catch(() => undefined);
    return { tipo: "iniciada", usuario };
  } catch (error) {
    if (error instanceof ErrorHttp && error.estado === 401) {
      return { tipo: "terminada", aviso: "sesionTerminada" };
    }
    // sin conexión o servidor caído: se entra con el usuario guardado
    const usuario = await leerUsuario();
    return usuario ? { tipo: "iniciada", usuario } : { tipo: "terminada", aviso: null };
  }
}

function olvidarSesion() {
  fijarToken(null);
  borrarSesionGuardada().catch(() => undefined);
}

type PropsSesionProvider = { children: ReactNode };

export default function SesionProvider({ children }: PropsSesionProvider) {
  const [estado, despachar] = useReducer(reducir, inicial);
  // el oyente de 401 necesita el estado actual sin volver a registrarse
  const estadoActual = useRef(estado);
  useEffect(() => {
    estadoActual.current = estado;
  }, [estado]);

  useEffect(() => {
    let vigente = true;
    arrancar().then((accion) => {
      if (!vigente) return;
      if (accion.tipo === "terminada" && accion.aviso) olvidarSesion();
      despachar(accion);
    });
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    // solo durante el uso: el 401 del arranque lo resuelve arrancar()
    alPerderSesion(() => {
      if (estadoActual.current.estado !== "conSesion") return;
      olvidarSesion();
      despachar({ tipo: "perdida" });
    });
    return () => alPerderSesion(null);
  }, []);

  // el token lo guarda pedir() al recibirlo; aquí falta el usuario
  const iniciar = useCallback(async (usuario: Usuario) => {
    await guardarUsuario(usuario).catch(() => undefined);
    despachar({ tipo: "iniciada", usuario });
  }, []);

  // los errores se relanzan para que el formulario los muestre
  const crearCuenta = useCallback(
    async (cuerpo: CuerpoCrearCuenta) => iniciar((await servicio.crearCuenta(cuerpo)).usuario),
    [iniciar],
  );

  const entrar = useCallback(
    async (cuerpo: CuerpoEntrar) => iniciar((await servicio.entrar(cuerpo)).usuario),
    [iniciar],
  );

  // El dispositivo queda sin sesión aunque no haya conexión; avisar a la API
  // es un extra (si no llega, la sesión vence sola en 30 días sin uso).
  const cerrarSesion = useCallback(() => {
    const token = tokenActual();
    olvidarSesion();
    despachar({ tipo: "cerrada" });
    servicio.cerrarSesion(token).catch(() => undefined);
  }, []);

  const valor = useMemo(
    () => ({ ...estado, crearCuenta, entrar, cerrarSesion }),
    [estado, crearCuenta, entrar, cerrarSesion],
  );

  return <SesionContext value={valor}>{children}</SesionContext>;
}
