import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import type { ResumenCurso } from "../tipos/contrato";
import { textoCantidadLecciones } from "../utilidades/cursos";
import PortadaCurso from "./PortadaCurso";

type Props = {
  curso: ResumenCurso;
};

// Un curso del catálogo; toda la tarjeta abre su detalle.
export default function TarjetaCurso({ curso }: Props) {
  const c = useColores();

  function abrir() {
    router.push({ pathname: "/curso/[idCurso]", params: { idCurso: curso.id } });
  }

  return (
    <Pressable
      onPress={abrir}
      accessibilityRole="button"
      accessibilityLabel={curso.titulo}
      style={({ pressed }) => [
        styles.tarjeta,
        { backgroundColor: c.superficie, borderColor: c.borde },
        pressed && styles.presionada,
      ]}
    >
      <PortadaCurso id={curso.id} titulo={curso.titulo} tamano="tarjeta" />
      <View style={styles.texto}>
        <Text style={[styles.titulo, { color: c.texto }]} numberOfLines={2}>
          {curso.titulo}
        </Text>
        <Text style={[styles.suave, { color: c.textoSuave }]}>Por {curso.autor.nombre}</Text>
        <Text style={[styles.descripcion, { color: c.texto }]} numberOfLines={3}>
          {curso.descripcion}
        </Text>
        <Text style={[styles.suave, { color: c.textoSuave }]}>
          {textoCantidadLecciones(curso.cantidadLecciones)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    gap: espacio.tres,
    padding: espacio.tres,
    borderWidth: 1,
    borderRadius: radio,
  },
  presionada: {
    opacity: 0.7,
  },
  texto: {
    flex: 1,
    gap: espacio.uno,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "700",
  },
  suave: {
    fontSize: 13,
  },
  descripcion: {
    fontSize: 15,
  },
});
