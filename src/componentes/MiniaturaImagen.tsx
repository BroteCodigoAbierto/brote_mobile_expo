import { StyleSheet, View } from "react-native";
import { medidasImagen, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import type { Imagen } from "../tipos/contrato";
import ImagenCurso from "./ImagenCurso";

type Props = {
  imagen: Imagen;
};

// Una imagen en la barra inferior al fallar (docs/diseno.md, sección 4; spec F13): 48 px, la
// imagen completa y un GIF quieto. Decorativa: el texto alternativo va a su lado.
export default function MiniaturaImagen({ imagen }: Props) {
  const c = useColores();
  return (
    <View
      style={[styles.miniatura, { backgroundColor: c.vidrioOpaco }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ImagenCurso imagen={imagen} llenar quieta />
    </View>
  );
}

const styles = StyleSheet.create({
  miniatura: {
    width: medidasImagen.miniatura,
    height: medidasImagen.miniatura,
    borderRadius: radio.chico,
    overflow: "hidden",
  },
});
