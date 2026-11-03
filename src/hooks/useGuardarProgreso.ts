import { useCallback, useEffect, useRef, useState } from "react";
import type { EstadoGuardado } from "../componentes/ResultadoLeccion";
import { ErrorConexion } from "../servicios/api";
import { esNoDisponible } from "../servicios/cursos";
import { guardarProgreso } from "../servicios/progreso";
import type { CuerpoProgresoLeccion } from "../tipos/contrato";

// Guarda el resultado de una lección al llegar a la pantalla final (spec F04;
// brote_specs, research de F04, punto 7). Se intenta una sola vez; volver a
// intentarlo lo decide el alumno con "Reintentar". El 401 ya lo maneja pedir().
// Sin conexión no se guarda para después: eso es F10.
export function useGuardarProgreso(
  idCurso: string,
  idLeccion: string,
  { aciertos, preguntas }: CuerpoProgresoLeccion,
) {
  const [estado, setEstado] = useState<EstadoGuardado>("guardando");
  // Dos refs y no una variable del efecto: StrictMode monta, desmonta y vuelve
  // a montar. `enviado` evita el segundo PUT y `montado` deja que la respuesta
  // del primero llegue al montaje que sigue vivo.
  const enviado = useRef(false);
  const montado = useRef(false);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const enviar = useCallback(() => {
    guardarProgreso(idCurso, idLeccion, { aciertos, preguntas })
      .then(() => {
        if (montado.current) setEstado("guardado");
      })
      .catch((error: unknown) => {
        if (montado.current) setEstado(estadoDeError(error));
      });
  }, [idCurso, idLeccion, aciertos, preguntas]);

  useEffect(() => {
    if (enviado.current) return;
    enviado.current = true;
    enviar();
  }, [enviar]);

  function reintentar() {
    setEstado("guardando");
    enviar();
  }

  return { estado, reintentar };
}

function estadoDeError(error: unknown): EstadoGuardado {
  if (esNoDisponible(error)) return "noDisponible";
  if (error instanceof ErrorConexion && error.sinConexion) return "sinConexion";
  return "error";
}
