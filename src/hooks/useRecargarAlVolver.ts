import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

// Vuelve a pedir los datos cada vez que la pantalla vuelve a tener el foco,
// salvo la primera (al montarse ya los pide). El detalle del curso y "Mis
// cursos" quedan montados debajo de otras pantallas, así que no se enterarían
// de una lección recién completada (brote_specs, research de F04, punto 8).
// `recargar` debe ser estable (la recarga silenciosa de usePeticion lo es): si
// cambiara en cada render, se volvería a pedir en cada render.
export function useRecargarAlVolver(recargar: () => void) {
  const primera = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (primera.current) {
        primera.current = false;
        return;
      }
      recargar();
    }, [recargar]),
  );
}
