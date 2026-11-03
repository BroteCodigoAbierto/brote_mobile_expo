import { router } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { espacio, fuentes } from "../constantes/tema";
import type { ResumenCurso } from "../tipos/contrato";
import { textoCantidadLecciones } from "../utilidades/cursos";
import Insignia from "./Insignia";
import PortadaCurso from "./PortadaCurso";
import Superficie from "./Superficie";
import Texto from "./Texto";

type Props = {
  curso: ResumenCurso;
};

// Un curso del catálogo; toda la tarjeta abre su detalle.
export default function TarjetaCurso({ curso }: Props) {
  function abrir() {
    router.push({ pathname: "/curso/[idCurso]", params: { idCurso: curso.id } });
  }

  return (
    <Pressable
      onPress={abrir}
      accessibilityRole="button"
      accessibilityLabel={curso.titulo}
      style={({ pressed }) => pressed && styles.presionada}
    >
      <Superficie style={styles.tarjeta}>
        <PortadaCurso id={curso.id} titulo={curso.titulo} tamano="tarjeta" />
        <View style={styles.texto}>
          <Texto variante="titulo3" numberOfLines={2}>
            {curso.titulo}
          </Texto>
          <Texto variante="nota" color="primario" style={styles.autor}>
            Por {curso.autor.nombre}
          </Texto>
          <Texto variante="cuerpoChico" color="textoSuave" numberOfLines={3}>
            {curso.descripcion}
          </Texto>
          <View style={styles.pie}>
            <Insignia icono={BookOpen} texto={textoCantidadLecciones(curso.cantidadLecciones)} />
          </View>
        </View>
      </Superficie>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    gap: espacio[5],
    padding: espacio[4],
  },
  presionada: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  texto: {
    flex: 1,
    gap: espacio[2],
  },
  autor: {
    fontFamily: fuentes.seminegrita,
  },
  pie: {
    paddingTop: espacio[3],
  },
});
