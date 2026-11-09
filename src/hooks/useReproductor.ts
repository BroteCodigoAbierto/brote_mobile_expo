import { useReducer } from "react";
import type { ResultadoActividad } from "../actividades/tipos";
import { CALIFICA_ACTIVIDAD, type Actividad } from "../tipos/contrato";

// Avance del alumno en una lección (spec F03). Vive solo mientras la pantalla
// está abierta; al terminar, la pantalla guarda el resultado (F04). El
// reproductor no sabe de la red.

type EstadoReproductor = {
  indice: number; // actividad actual; igual a total cuando terminó
  resultados: ResultadoActividad[];
  // ya hizo algo: pasó de la primera actividad o eligió, escribió, volteó, colocó o unió algo
  hizoAlgo: boolean;
};

type Accion =
  { tipo: "interactuar" } | { tipo: "terminarActividad"; resultado: ResultadoActividad };

function reductor(estado: EstadoReproductor, accion: Accion): EstadoReproductor {
  switch (accion.tipo) {
    case "interactuar":
      return estado.hizoAlgo ? estado : { ...estado, hizoAlgo: true };
    case "terminarActividad":
      return {
        indice: estado.indice + 1,
        resultados: [...estado.resultados, accion.resultado],
        hizoAlgo: true,
      };
  }
}

const inicial: EstadoReproductor = { indice: 0, resultados: [], hizoAlgo: false };

export function useReproductor(actividades: Actividad[]) {
  const [estado, despachar] = useReducer(reductor, inicial);
  const { indice, resultados, hizoAlgo } = estado;
  const total = actividades.length;

  return {
    indice,
    total,
    terminada: indice >= total,
    hizoAlgo,
    // Las preguntas salen del contrato, igual que en el backend, que rechaza un
    // resultado con otro número (research de F04, punto 2). Si un componente
    // calificable reportara "sinCalificar", contaría como fallo.
    preguntas: actividades.filter((actividad) => CALIFICA_ACTIVIDAD[actividad.tipo]).length,
    aciertos: resultados.filter((resultado) => resultado === "acierto").length,
    interactuar: () => despachar({ tipo: "interactuar" }),
    terminarActividad: (resultado: ResultadoActividad) =>
      despachar({ tipo: "terminarActividad", resultado }),
  };
}

export type Reproductor = ReturnType<typeof useReproductor>;
