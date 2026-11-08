import { Image } from "expo-image";
import * as Network from "expo-network";
import { useEffect, useMemo, useState } from "react";
import { cabecerasSesion } from "../servicios/api";
import type { Actividad } from "../tipos/contrato";
import { imagenesDe, urlImagen } from "../utilidades/imagenes";

// Al abrir la lección, todas sus imágenes, sin esperarlas (spec F13, "Aclaraciones"): así,
// si después se pierde la conexión, lo que ya llegó se sigue viendo. Devuelve el intento,
// que sube cuando vuelve la conexión, y entonces precarga otra vez (research de F13, punto
// 11).
export function usePrecargarImagenes(actividades: Actividad[]): number {
  const [intento, setIntento] = useState(0);
  const urls = useMemo(
    () => [...new Set(actividades.flatMap(imagenesDe).map(({ id }) => urlImagen(id)))],
    [actividades],
  );

  useEffect(() => {
    if (urls.length === 0) return;
    // https://docs.expo.dev/versions/v58.0.0/sdk/image/#prefetchurls-options
    Image.prefetch(urls, { headers: cabecerasSesion(), cachePolicy: "memory-disk" }).catch(
      () => undefined,
    );
  }, [urls, intento]);

  useEffect(() => {
    let conectado = true;
    // https://docs.expo.dev/versions/v58.0.0/sdk/network/
    const suscripcion = Network.addNetworkStateListener(({ isConnected, isInternetReachable }) => {
      const ahora = isConnected !== false && isInternetReachable !== false;
      if (ahora && !conectado) setIntento((n) => n + 1);
      conectado = ahora;
    });
    return () => suscripcion.remove();
  }, []);

  return intento;
}
