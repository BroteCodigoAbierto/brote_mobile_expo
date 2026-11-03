import { useCallback, useEffect, useReducer } from "react";
import { leerErrorDeCarga, traerCatalogo } from "../servicios/cursos";
import type { RespuestaCatalogo, ResumenCurso } from "../tipos/contrato";

// Estado del catálogo (spec F02), con las mismas reglas que el CatalogoContext
// de la web. No hace falta un contexto: la pestaña "Explorar" sigue montada
// debajo del detalle, así que al volver todo está como se dejó.

export type EstadoCatalogo = {
  // la búsqueda, ya recortada, de lo que está en pantalla (la lista o el
  // error); null hasta la primera respuesta. La que está en camino no cuenta
  consulta: string | null;
  cursos: ResumenCurso[];
  // cursor para pedir los 10 siguientes; null si no hay más
  siguiente: string | null;
  // la primera carga de la consulta: sin lista mientras carga o si falló
  fase: "cargando" | "listo" | "error";
  // hay una búsqueda nueva en camino y la lista anterior sigue en pantalla
  buscando: boolean;
  cargandoMas: boolean;
  errorMas: unknown;
  error: unknown;
  // deslizar hacia abajo: la lista sigue en pantalla mientras se recarga
  recargando: boolean;
  errorRecarga: unknown;
};

// El pedido que falta hacer o que está en camino. Cada respuesta trae el
// pedido que la originó (con su consulta) y solo cuenta si sigue siendo el
// vigente: así lo que se ve corresponde siempre al último texto escrito.
type Pendiente =
  | { tipo: "primera"; consulta: string }
  | { tipo: "recarga"; consulta: string }
  | { tipo: "mas"; consulta: string; despues: string };

type Estado = EstadoCatalogo & { pendiente: Pendiente | null };

type Accion =
  | { tipo: "buscar"; consulta: string }
  | { tipo: "cargarMas" }
  | { tipo: "reintentar" }
  | { tipo: "recargar" }
  | { tipo: "llegaron"; pendiente: Pendiente; respuesta: RespuestaCatalogo }
  | { tipo: "fallo"; pendiente: Pendiente; error: unknown };

const inicial: Estado = {
  consulta: null,
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

// La búsqueda que se va a mostrar: la que está en camino o, si no hay, la que
// está en pantalla.
function consultaVigente(actual: Estado): string | null {
  const { pendiente } = actual;
  return pendiente && pendiente.tipo !== "mas" ? pendiente.consulta : actual.consulta;
}

// Pide desde el primer curso. Si hay una lista en pantalla se queda, atenuada,
// hasta que llegan los resultados (spec F02, "Buscando").
function pedirPrimera(actual: Estado, consulta: string): Estado {
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
    pendiente: { tipo: "primera", consulta },
  };
}

function pedirMas(actual: Estado, consulta: string, despues: string): Estado {
  return {
    ...actual,
    cargandoMas: true,
    errorMas: null,
    pendiente: { tipo: "mas", consulta, despues },
  };
}

// Mientras llega una búsqueda, una recarga o la primera carga, no se piden más.
function hayCargaPrincipal(actual: Estado): boolean {
  return actual.fase !== "listo" || actual.buscando || actual.recargando;
}

function reducir(actual: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "buscar":
      // la misma búsqueda no se pide otra vez, salvo que haya fallado
      if (accion.consulta === consultaVigente(actual) && actual.fase !== "error") return actual;
      return pedirPrimera(actual, accion.consulta);
    case "cargarMas":
      // una sola carga a la vez, y nunca con cursos de una búsqueda anterior
      if (
        actual.consulta === null ||
        !actual.siguiente ||
        actual.cargandoMas ||
        hayCargaPrincipal(actual)
      ) {
        return actual;
      }
      return pedirMas(actual, actual.consulta, actual.siguiente);
    case "reintentar":
      if (actual.consulta === null) return actual;
      if (actual.fase === "error") return pedirPrimera(actual, actual.consulta);
      if (actual.errorMas && actual.siguiente) {
        return pedirMas(actual, actual.consulta, actual.siguiente);
      }
      return actual;
    case "recargar":
      if (actual.consulta === null) return actual;
      if (actual.fase === "error") return pedirPrimera(actual, actual.consulta);
      if (hayCargaPrincipal(actual)) return actual;
      // vuelve a los primeros 10 de la misma búsqueda; los 10 siguientes que
      // estaban en camino ya no cuentan
      return {
        ...actual,
        recargando: true,
        errorRecarga: null,
        cargandoMas: false,
        pendiente: { tipo: "recarga", consulta: actual.consulta },
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
        consulta: accion.pendiente.consulta,
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
          consulta: accion.pendiente.consulta,
          fase: "error",
          buscando: false,
          error: accion.error,
          pendiente: null,
        };
      }
      // los cursos ya cargados siguen en pantalla
      if (accion.pendiente.tipo === "recarga") {
        return { ...actual, recargando: false, errorRecarga: accion.error, pendiente: null };
      }
      return { ...actual, cargandoMas: false, errorMas: accion.error, pendiente: null };
  }
}

export function useCatalogo() {
  const [estado, despachar] = useReducer(reducir, inicial);
  const { pendiente, ...catalogo } = estado;

  useEffect(() => {
    if (!pendiente) return;
    const despues = pendiente.tipo === "mas" ? pendiente.despues : null;
    traerCatalogo({ q: pendiente.consulta, despues })
      .then((respuesta) => despachar({ tipo: "llegaron", pendiente, respuesta }))
      .catch((error: unknown) => despachar({ tipo: "fallo", pendiente, error }));
  }, [pendiente]);

  const buscar = useCallback((consulta: string) => despachar({ tipo: "buscar", consulta }), []);
  const cargarMas = useCallback(() => despachar({ tipo: "cargarMas" }), []);
  const reintentar = useCallback(() => despachar({ tipo: "reintentar" }), []);
  const recargar = useCallback(() => despachar({ tipo: "recargar" }), []);

  const fallo = catalogo.error ?? catalogo.errorMas;
  return {
    ...catalogo,
    buscar,
    cargarMas,
    reintentar,
    recargar,
    // lo que se muestra si falló la primera carga o la de los 10 siguientes
    mensajeError: fallo ? leerErrorDeCarga(fallo) : null,
    // si falló deslizar hacia abajo: se muestra arriba de la lista
    mensajeErrorRecarga: catalogo.errorRecarga ? leerErrorDeCarga(catalogo.errorRecarga) : null,
  };
}
