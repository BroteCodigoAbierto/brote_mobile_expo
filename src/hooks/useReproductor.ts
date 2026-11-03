import { useReducer } from "react";
import type { ResultadoActividad } from "../actividades/tipos";

// Avance del alumno en una lección (spec F03). Vive solo mientras la pantalla
// está abierta: no se guarda nada (el progreso llega con F04).

type EstadoReproductor = {
  indice: number; // actividad actual; igual a total cuando terminó
  resultados: ResultadoActividad[];
  // ya hizo algo: pasó de la primera actividad o eligió, escribió o volteó algo
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

export function useReproductor(total: number) {
  const [estado, despachar] = useReducer(reductor, inicial);
  const { indice, resultados, hizoAlgo } = estado;

  return {
    indice,
    total,
    terminada: indice >= total,
    hizoAlgo,
    // la teoría y las tarjetas no cuentan como preguntas
    preguntas: resultados.filter((resultado) => resultado !== "sinCalificar").length,
    aciertos: resultados.filter((resultado) => resultado === "acierto").length,
    interactuar: () => despachar({ tipo: "interactuar" }),
    terminarActividad: (resultado: ResultadoActividad) =>
      despachar({ tipo: "terminarActividad", resultado }),
  };
}

export type Reproductor = ReturnType<typeof useReproductor>;
