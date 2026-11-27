import { useCallback, useEffect, useReducer } from "react";
import { leerErrorDeCarga, traerCatalogo, type FiltrosCatalogo } from "../servicios/cursos";
import type { RespuestaCatalogo, ResumenCurso } from "../tipos/contrato";

// Estado del catálogo (spec F02 + F16), con soporte para búsqueda, filtros y
// espacio de organización opcional. La pestaña "Explorar" sigue montada debajo
// del detalle, así que al volver todo está como se dejó.

export type EstadoCatalogo = {
  // filtros vigentes de lo que está en pantalla; null hasta la primera respuesta
  filtros: FiltrosCatalogo | null;
  cursos: ResumenCurso[];
  // cursor para pedir los siguientes cursos; null si no hay más
  siguiente: string | null;
  // la primera carga de los filtros: sin lista mientras carga o si falló
  fase: "cargando" | "listo" | "error";
  // hay una búsqueda o filtro nuevo en camino y la lista anterior sigue en pantalla
  buscando: boolean;
  cargandoMas: boolean;
  errorMas: unknown;
  error: unknown;
  // deslizar hacia abajo: la lista sigue en pantalla mientras se recarga
  recargando: boolean;
  errorRecarga: unknown;
};

type Pendiente =
  | { tipo: "primera"; filtros: FiltrosCatalogo; clave: string }
  | { tipo: "recarga"; filtros: FiltrosCatalogo; clave: string; enSilencio: boolean }
  | { tipo: "mas"; filtros: FiltrosCatalogo; clave: string; despues: string };

type Estado = EstadoCatalogo & { clave: string | null; pendiente: Pendiente | null };

type Accion =
  | { tipo: "buscar"; filtros: FiltrosCatalogo }
  | { tipo: "cargarMas" }
  | { tipo: "reintentar" }
  | { tipo: "recargar"; enSilencio: boolean }
  | { tipo: "llegaron"; pendiente: Pendiente; respuesta: RespuestaCatalogo }
  | { tipo: "fallo"; pendiente: Pendiente; error: unknown };

const inicial: Estado = {
  filtros: null,
  clave: null,
  cursos: [],
  siguiente: null,
  fase: "cargando",
  buscando: false,
  cargandoMas: false,
  errorMas: null,
  error: null,
  recargando: false,
  errorRecarga: null,
  pendiente: null,
};

function claveDeFiltros(f: FiltrosCatalogo): string {
  return JSON.stringify([
    f.q,
    f.categoria ?? "",
    f.nivel ?? "",
    f.idioma ?? "",
    f.orden ?? "recientes",
    Boolean(f.ocultarCompletados),
    f.organizacion ?? "",
  ]);
}

function claveVigente(actual: Estado): string | null {
  const { pendiente } = actual;
  return pendiente && pendiente.tipo !== "mas" ? pendiente.clave : actual.clave;
}

function pedirPrimera(actual: Estado, filtros: FiltrosCatalogo): Estado {
  const conLista = actual.fase === "listo";
  return {
    ...actual,
    fase: conLista ? "listo" : "cargando",
    buscando: conLista,
    cargandoMas: false,
    errorMas: null,
    error: null,
    recargando: false,
    errorRecarga: null,
    pendiente: { tipo: "primera", filtros, clave: claveDeFiltros(filtros) },
  };
}

function pedirMas(actual: Estado, filtros: FiltrosCatalogo, despues: string): Estado {
  return {
    ...actual,
    cargandoMas: true,
    errorMas: null,
    pendiente: { tipo: "mas", filtros, clave: claveDeFiltros(filtros), despues },
  };
}

function hayCargaPrincipal(actual: Estado): boolean {
  return actual.fase !== "listo" || actual.buscando || actual.recargando;
}

function reducir(actual: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "buscar": {
      const clave = claveDeFiltros(accion.filtros);
      if (clave === claveVigente(actual) && actual.fase !== "error") return actual;
      return pedirPrimera(actual, accion.filtros);
    }
    case "cargarMas":
      if (
        actual.filtros === null ||
        !actual.siguiente ||
        actual.cargandoMas ||
        hayCargaPrincipal(actual)
      ) {
        return actual;
      }
      return pedirMas(actual, actual.filtros, actual.siguiente);
    case "reintentar":
      if (actual.filtros === null) return actual;
      if (actual.fase === "error") return pedirPrimera(actual, actual.filtros);
      if (actual.errorMas && actual.siguiente) {
        return pedirMas(actual, actual.filtros, actual.siguiente);
      }
      return actual;
    case "recargar":
      if (actual.filtros === null) return actual;
      if (actual.fase === "error") return pedirPrimera(actual, actual.filtros);
      if (hayCargaPrincipal(actual)) return actual;
      return {
        ...actual,
        recargando: !accion.enSilencio,
        errorRecarga: null,
        cargandoMas: false,
        pendiente: {
          tipo: "recarga",
          filtros: actual.filtros,
          clave: claveDeFiltros(actual.filtros),
          enSilencio: accion.enSilencio,
        },
      };
    case "llegaron":
      if (accion.pendiente !== actual.pendiente) return actual;
      if (accion.pendiente.tipo === "mas") {
        return {
          ...actual,
          cursos: [...actual.cursos, ...accion.respuesta.cursos],
          siguiente: accion.respuesta.siguiente,
          cargandoMas: false,
          pendiente: null,
        };
      }
      return {
        ...actual,
        filtros: accion.pendiente.filtros,
        clave: accion.pendiente.clave,
        cursos: accion.respuesta.cursos,
        siguiente: accion.respuesta.siguiente,
        fase: "listo",
        buscando: false,
        errorMas: null,
        recargando: false,
        errorRecarga: null,
        pendiente: null,
      };
    case "fallo":
      if (accion.pendiente !== actual.pendiente) return actual;
      if (accion.pendiente.tipo === "primera") {
        return {
          ...actual,
          filtros: accion.pendiente.filtros,
          clave: accion.pendiente.clave,
          fase: "error",
          buscando: false,
          error: accion.error,
          pendiente: null,
        };
      }
      if (accion.pendiente.tipo === "recarga") {
        const errorRecarga = accion.pendiente.enSilencio ? null : accion.error;
        return { ...actual, recargando: false, errorRecarga, pendiente: null };
      }
      return { ...actual, cargandoMas: false, errorMas: accion.error, pendiente: null };
  }
}

export function useCatalogo() {
  const [estado, despachar] = useReducer(reducir, inicial);
  const { pendiente, clave: _clave, ...catalogo } = estado;
  void _clave;

  useEffect(() => {
    if (!pendiente) return;
    const despues = pendiente.tipo === "mas" ? pendiente.despues : null;
    traerCatalogo({ ...pendiente.filtros, despues })
      .then((respuesta) => despachar({ tipo: "llegaron", pendiente, respuesta }))
      .catch((error: unknown) => despachar({ tipo: "fallo", pendiente, error }));
  }, [pendiente]);

  const buscar = useCallback(
    (filtros: FiltrosCatalogo) => despachar({ tipo: "buscar", filtros }),
    [],
  );
  const cargarMas = useCallback(() => despachar({ tipo: "cargarMas" }), []);
  const reintentar = useCallback(() => despachar({ tipo: "reintentar" }), []);
  const recargar = useCallback(() => despachar({ tipo: "recargar", enSilencio: false }), []);
  const recargarEnSilencio = useCallback(
    () => despachar({ tipo: "recargar", enSilencio: true }),
    [],
  );

  const fallo = catalogo.error ?? catalogo.errorMas;
  return {
    ...catalogo,
    buscar,
    cargarMas,
    reintentar,
    recargar,
    recargarEnSilencio,
    mensajeError: fallo ? leerErrorDeCarga(fallo) : null,
    mensajeErrorRecarga: catalogo.errorRecarga ? leerErrorDeCarga(catalogo.errorRecarga) : null,
  };
}
