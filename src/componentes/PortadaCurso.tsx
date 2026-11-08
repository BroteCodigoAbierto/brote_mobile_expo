import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { aclarar, coloresPortada, fuentes, radio, sobrePortada } from "../constantes/tema";
import type { Imagen } from "../tipos/contrato";
import { indiceColorPortada, inicialPortada } from "../utilidades/cursos";
import ImagenCurso from "./ImagenCurso";

type Props = {
  id: string;
  titulo: string;
  tamano: "tarjeta" | "detalle";
  // F13: la imagen de la portada; sin ella, la generada
  idPortada?: string | null;
};

// La portada generada es la inicial del título sobre un degradado del color que sale del id
// (docs/diseno.md, sección 2.1). Con imagen (F13), la imagen la llena, recortada al centro;
// mientras carga se ve el color sin la inicial, y si no carga, la generada. Es decorativa:
// el título siempre va al lado; por eso los lectores de pantalla la saltan.
export default function PortadaCurso({ id, titulo, tamano, idPortada }: Props) {
  const [fallo, setFallo] = useState<string | null>(null);
  const conImagen = Boolean(idPortada) && fallo !== idPortada;
  const esDetalle = tamano === "detalle";
  const color = coloresPortada[indiceColorPortada(id)];
  const degradado =
    "radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.28), transparent 38%), " +
    `linear-gradient(135deg, ${color}, ${aclarar(color)})`;

  return (
    <View
      style={[
        styles.portada,
        esDetalle ? styles.detalle : styles.tarjeta,
        { backgroundColor: color, experimental_backgroundImage: degradado },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {conImagen && idPortada ? (
        <ImagenCurso
          key={idPortada}
          imagen={imagenDePortada(idPortada)}
          ajuste="cubrir"
          llenar
          alFallar={() => setFallo(idPortada)}
          // mientras carga, se ve el color sin la inicial
          style={styles.imagen}
        />
      ) : (
        <Text style={[styles.inicial, esDetalle ? styles.inicialDetalle : styles.inicialTarjeta]}>
          {inicialPortada(titulo)}
        </Text>
      )}
    </View>
  );
}

// Para la portada basta el id: se recorta para llenar, así que su tamaño no importa.
function imagenDePortada(id: string): Imagen {
  return { id, formato: "png", ancho: 1, alto: 1, peso: 0 };
}

const styles = StyleSheet.create({
  imagen: {
    backgroundColor: "transparent",
  },
  portada: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderCurve: "continuous",
  },
  tarjeta: {
    width: 84,
    height: 84,
    borderRadius: radio.medio,
  },
  detalle: {
    width: 120,
    height: 120,
    borderRadius: radio.grande,
  },
  inicial: {
    color: sobrePortada,
    fontFamily: fuentes.extranegrita,
    textShadowColor: "rgba(0, 0, 0, 0.18)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  inicialTarjeta: {
    fontSize: 36,
    lineHeight: 42,
  },
  inicialDetalle: {
    fontSize: 54,
    lineHeight: 62,
  },
});
