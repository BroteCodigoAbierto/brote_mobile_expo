import { useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { medidasImagen, radio } from "../constantes/tema";
import type { ImagenActividad } from "../tipos/contrato";
import { esGif } from "../utilidades/imagenes";
import BotonPausa from "./BotonPausa";
import ImagenCurso from "./ImagenCurso";
import VisorImagen from "./VisorImagen";

type Props = {
  imagen: ImagenActividad;
};

// La imagen de la teoría y de la pregunta (docs/diseno.md, sección 4; spec F13): tan ancha
// como la actividad o como la imagen, lo que sea menor, sin pasar de la mitad del alto de la
// pantalla, y centrada. Tocarla la abre en grande; abrirla no cuenta como haber hecho algo.
export default function ImagenAmpliable({ imagen }: Props) {
  const { height } = useWindowDimensions();
  const reducirMovimiento = useReducedMotion();
  const [pausada, setPausada] = useState(reducirMovimiento);
  const [abierta, setAbierta] = useState(false);
  const proporcion = imagen.ancho / imagen.alto;
  const anchoMax = Math.min(imagen.ancho, height * medidasImagen.altoImagenMax * proporcion);

  return (
    <View style={[styles.contenedor, { maxWidth: anchoMax }]}>
      <Pressable
        onPress={() => setAbierta(true)}
        accessibilityRole="imagebutton"
        accessibilityLabel={imagen.textoAlternativo || "Imagen"}
        accessibilityHint="Toca para ampliarla"
        style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
      >
        <ImagenCurso imagen={imagen} pausada={pausada} etiqueta={imagen.textoAlternativo} />
      </Pressable>
      {esGif(imagen) && <BotonPausa pausada={pausada} alPulsar={() => setPausada(!pausada)} />}
      <VisorImagen
        imagen={imagen}
        abierto={abierta}
        pausadaInicial={pausada}
        alCerrar={() => setAbierta(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    alignSelf: "center",
  },
  boton: {
    borderRadius: radio.medio,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  presionado: {
    opacity: 0.9,
  },
});
