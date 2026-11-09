import { StyleSheet, View } from "react-native";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import type { ImagenActividad } from "../tipos/contrato";
import ImagenCurso from "./ImagenCurso";

type Props = {
  imagen: ImagenActividad;
  quieta?: boolean;
  pausada?: boolean;
};

// El cuadro de una opción o un elemento de imagen (docs/diseno.md, sección 4; spec F13): la
// imagen completa, sin recortar, y lo que sobra con el fondo del mosaico, también detrás de
// un PNG transparente. Llena el cuadro que le da quien lo usa.
export default function MosaicoImagen({ imagen, quieta, pausada }: Props) {
  const c = useColores();
  return (
    <View style={[styles.mosaico, { backgroundColor: c.vidrioSuave }]}>
      <ImagenCurso
        imagen={imagen}
        llenar
        quieta={quieta}
        pausada={pausada}
        etiqueta={imagen.textoAlternativo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mosaico: {
    width: "100%",
    height: "100%",
    padding: espacio[2],
    borderRadius: radio.medio,
    overflow: "hidden",
  },
});
