import { Image } from "expo-image";
import { ImageOff } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { espacio } from "../constantes/tema";
import { useImagenes } from "../contextos/ContextoImagenes";
import { useColores } from "../hooks/useColores";
import { MENSAJES_IMAGENES, type Imagen } from "../tipos/contrato";
import { esGif, fuenteImagen } from "../utilidades/imagenes";
import Texto from "./Texto";

type Fase = "cargando" | "cargada" | "fallo";

type Props = {
  imagen: Imagen;
  ajuste?: "contener" | "cubrir";
  // un GIF se ve quieto en su primer cuadro (la miniatura)
  quieta?: boolean;
  // un GIF se detiene en el cuadro donde va
  pausada?: boolean;
  // lo que se ve si no carga: el texto alternativo
  etiqueta?: string;
  // llena la caja que le da quien la usa (mosaicos, portada); si no, guarda su proporción
  llenar?: boolean;
  // la portada vuelve a la generada si no carga
  alFallar?: () => void;
  style?: StyleProp<ViewStyle>;
};

// Toda imagen de un curso (docs/diseno.md, sección 4; spec F13), con expo-image: manda el
// token, guarda en caché y pausa los GIF (research de F13, punto 10). Reserva su lugar con la
// proporción de la imagen. Es decorativa: el nombre accesible lo pone quien la usa. Si falla,
// se vuelve a pedir cuando vuelve la conexión.
export default function ImagenCurso({
  imagen,
  ajuste = "contener",
  quieta = false,
  pausada = false,
  etiqueta,
  llenar = false,
  alFallar,
  style,
}: Props) {
  const c = useColores();
  const { intento } = useImagenes();
  const vista = useRef<Image>(null);
  const [estado, setEstado] = useState<{ fase: Fase; intento: number; vuelta: number }>({
    fase: "cargando",
    intento,
    vuelta: 0,
  });
  if (estado.fase === "fallo" && intento > estado.intento) {
    setEstado({ fase: "cargando", intento, vuelta: estado.vuelta + 1 });
  }
  const animada = esGif(imagen);
  const quieto = quieta || pausada;

  // stopAnimating deja el cuadro actual y startAnimating sigue desde ahí (research de F13,
  // punto 10, por confirmar en el teléfono con T075)
  useEffect(() => {
    if (!animada || estado.fase !== "cargada") return;
    if (quieto) void vista.current?.stopAnimating();
    else void vista.current?.startAnimating();
  }, [animada, quieto, estado.fase]);

  return (
    <View
      style={[
        styles.contenedor,
        llenar ? styles.llenar : { aspectRatio: imagen.ancho / imagen.alto },
        estado.fase !== "cargada" && { backgroundColor: c.vidrioSuave },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {estado.fase === "fallo" ? (
        <View style={styles.fallo}>
          <ImageOff size={24} color={c.textoTenue} />
          <Texto variante="nota" color="textoSuave" numberOfLines={4} style={styles.texto}>
            {etiqueta || MENSAJES_IMAGENES.sinCargar}
          </Texto>
        </View>
      ) : (
        <Image
          ref={vista}
          key={estado.vuelta}
          source={fuenteImagen(imagen.id)}
          contentFit={ajuste === "cubrir" ? "cover" : "contain"}
          cachePolicy="memory-disk"
          autoplay={!quieto}
          onLoad={() => setEstado((actual) => ({ ...actual, fase: "cargada" }))}
          onError={() => {
            setEstado((actual) => ({ ...actual, fase: "fallo" }));
            alFallar?.();
          }}
          style={styles.imagen}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    overflow: "hidden",
  },
  llenar: {
    height: "100%",
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  fallo: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: espacio[2],
    padding: espacio[3],
  },
  texto: {
    textAlign: "center",
  },
});
