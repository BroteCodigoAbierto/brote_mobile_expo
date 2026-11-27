import { router } from "expo-router";
import { Award, BookOpen, Building2, CircleCheck } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { espacio, fuentes } from "../constantes/tema";
import { NOMBRE_CATEGORIA, NOMBRE_NIVEL, type ResumenCurso } from "../tipos/contrato";
import { textoCantidadLecciones } from "../utilidades/cursos";
import { textoAvance } from "../utilidades/progreso";
import AvanceCurso from "./AvanceCurso";
import Insignia from "./Insignia";
import PortadaCurso from "./PortadaCurso";
import Superficie from "./Superficie";
import Texto from "./Texto";

type Props = {
  curso: ResumenCurso;
  // con él, la tarjeta de un curso empezado ("Mis cursos", F04)
  avance?: { completadas: number; total: number };
};

// Un curso del catálogo, o uno empezado con su avance en lugar de la
// descripción; toda la tarjeta abre su detalle.
export default function TarjetaCurso({ curso, avance }: Props) {
  function abrir() {
    router.push({ pathname: "/curso/[idCurso]", params: { idCurso: curso.id } });
  }

  // el botón se anuncia con el avance: "Git esencial, 2 de 6 lecciones"
  const nombre = avance
    ? [
        curso.titulo,
        textoAvance(avance.completadas, avance.total),
        ...(avance.total > 0 && avance.completadas >= avance.total ? ["Curso terminado"] : []),
      ].join(", ")
    : [
        curso.titulo,
        NOMBRE_CATEGORIA[curso.categoria],
        NOMBRE_NIVEL[curso.nivel],
        ...(curso.organizacion ? [curso.organizacion.nombre] : []),
        ...(curso.completado ? ["Completado"] : []),
      ].join(", ");

  return (
    <Pressable
      onPress={abrir}
      accessibilityRole="button"
      accessibilityLabel={nombre}
      style={({ pressed }) => pressed && styles.presionada}
    >
      <Superficie style={styles.tarjeta}>
        <PortadaCurso
          id={curso.id}
          titulo={curso.titulo}
          tamano="tarjeta"
          idPortada={curso.idPortada}
        />
        <View style={styles.texto}>
          <Texto variante="titulo3" numberOfLines={2}>
            {curso.titulo}
          </Texto>
          <Texto variante="nota" color="primario" style={styles.autor}>
            Por {curso.autor.nombre}
          </Texto>
          {avance ? (
            <View style={styles.pie}>
              <AvanceCurso completadas={avance.completadas} total={avance.total} />
            </View>
          ) : (
            <>
              <Texto variante="cuerpoChico" color="textoSuave" numberOfLines={2}>
                {curso.descripcion}
              </Texto>
              <View style={styles.etiquetas}>
                {curso.organizacion && (
                  <Insignia
                    tono="primario"
                    icono={Building2}
                    texto={curso.organizacion.nombre}
                  />
                )}
                <Insignia
                  icono={BookOpen}
                  texto={textoCantidadLecciones(curso.cantidadLecciones)}
                />
                <Insignia texto={NOMBRE_CATEGORIA[curso.categoria]} />
                <Insignia texto={NOMBRE_NIVEL[curso.nivel]} />
                {curso.daInsignia && <Insignia tono="acento" icono={Award} texto="Insignia" />}
                {curso.completado && (
                  <Insignia tono="brote" icono={CircleCheck} texto="Completado" />
                )}
              </View>
            </>
          )}
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
  etiquetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio[2],
    paddingTop: espacio[2],
  },
});
