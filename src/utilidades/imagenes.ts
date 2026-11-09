import type { ImageSource } from "expo-image";
import { URL_API } from "../config";
import { cabecerasSesion } from "../servicios/api";
import {
  RUTA_IMAGENES,
  type Actividad,
  type ContenidoElemento,
  type Imagen,
  type ImagenActividad,
} from "../tipos/contrato";

// Las imágenes de los cursos (spec F13). expo-image las pide con el token de la sesión, como
// pedir() (brote_specs, research de F13, punto 5). La web tiene las mismas funciones.

export function urlImagen(id: string): string {
  return `${URL_API}${RUTA_IMAGENES}/${id}`;
}

// La caché de expo-image va por id: el token puede cambiar, la imagen no.
export function fuenteImagen(id: string): ImageSource {
  return { uri: urlImagen(id), headers: cabecerasSesion(), cacheKey: id };
}

export function esGif(imagen: Imagen): boolean {
  return imagen.formato === "gif";
}

// Un elemento de relacionar es un texto o una imagen.
export function esImagen(contenido: ContenidoElemento): contenido is ImagenActividad {
  return typeof contenido !== "string";
}

// Todas las imágenes de una actividad, en el orden en que aparecen.
export function imagenesDe(actividad: Actividad): ImagenActividad[] {
  switch (actividad.tipo) {
    case "teoria":
      return actividad.imagenes ?? [];
    case "opcionMultiple":
      return [
        ...(actividad.imagen ? [actividad.imagen] : []),
        ...actividad.opciones.flatMap((opcion) => ("imagen" in opcion ? [opcion.imagen] : [])),
      ];
    case "emparejar":
      return actividad.parejas.flatMap(({ izquierda, derecha }) =>
        [izquierda, derecha].filter(esImagen),
      );
    case "clasificar":
      return actividad.elementos.flatMap((elemento) =>
        "imagen" in elemento ? [elemento.imagen] : [],
      );
    case "ordenar":
      return actividad.elementos.filter(esImagen);
    default:
      return [];
  }
}
