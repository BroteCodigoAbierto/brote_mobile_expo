import { useCallback, useEffect, useState } from "react";

// Envuelve una función que trae datos y expone los estados que piden las specs:
// cargando, datos y error. `recargar` vuelve a pedirlos. `recargarEnSilencio`
// también, pero sin poner `cargando` (no aparece el RefreshControl): si
// responde, reemplaza los datos y borra el error; si falla, deja los datos y
// pone el error, para mostrar el aviso encima (brote_specs, research de F04,
// punto 8).
// `traer` debe ser estable (una función de servicios/ o envuelta en useCallback),
// si no, se vuelve a pedir en cada render.
export function usePeticion<T>(traer: () => Promise<T>) {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // si llega una respuesta vieja (se desmontó o se recargó), se ignora
    let vigente = true;
    traer()
      .then((respuesta) => {
        if (vigente) {
          setDatos(respuesta);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (vigente) setError(err);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [traer, intento]);

  function recargar() {
    setCargando(true);
    setError(null);
    setIntento((n) => n + 1);
  }

  // estable: useRecargarAlVolver la usa en un efecto
  const recargarEnSilencio = useCallback(() => setIntento((n) => n + 1), []);

  return { datos, cargando, error, recargar, recargarEnSilencio };
}
