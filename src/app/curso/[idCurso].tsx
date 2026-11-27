import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  CircleCheck,
  CircleSlash,
  GitFork,
  NotebookPen,
} from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvanceCurso from "../../componentes/AvanceCurso";
import Aviso from "../../componentes/Aviso";
import Boton from "../../componentes/Boton";
import ErrorCarga from "../../componentes/ErrorCarga";
import EstadoVacio from "../../componentes/EstadoVacio";
import FondoAmbiental from "../../componentes/FondoAmbiental";
import IndicadorCarga from "../../componentes/IndicadorCarga";
import Insignia from "../../componentes/Insignia";
import PortadaCurso from "../../componentes/PortadaCurso";
import Superficie from "../../componentes/Superficie";
import Texto from "../../componentes/Texto";
import { espacio, fuentes, MARGEN_PANTALLA, radio } from "../../constantes/tema";
import { useColores } from "../../hooks/useColores";
import { usePeticion } from "../../hooks/usePeticion";
import { useRecargarAlVolver } from "../../hooks/useRecargarAlVolver";
import { esNoDisponible, leerErrorDeCarga, traerCurso } from "../../servicios/cursos";
import {
  MENSAJES_CATALOGO,
  NOMBRE_CATEGORIA,
  NOMBRE_IDIOMA,
  NOMBRE_NIVEL,
  type DetalleCurso as Curso,
} from "../../tipos/contrato";
import { textoCantidadLecciones } from "../../utilidades/cursos";
import { avanceCurso, textoAciertos, textoBotonSiguiente } from "../../utilidades/progreso";

function abrirLeccion(idCurso: string, idLeccion: string) {
  router.push({ pathname: "/leccion/[idCurso]/[idLeccion]", params: { idCurso, idLeccion } });
}

type BloqueModulo = {
  titulo: string | null;
  lecciones: Curso["lecciones"];
};

function agruparPorModulo(lecciones: Curso["lecciones"]): BloqueModulo[] {
  const tieneModulos = lecciones.some((l) => Boolean(l.modulo?.trim()));
  if (!tieneModulos) return [{ titulo: null, lecciones }];

  const bloques: BloqueModulo[] = [];
  for (const leccion of lecciones) {
    const titulo = leccion.modulo?.trim() || "General";
    const ultimo = bloques[bloques.length - 1];
    if (ultimo && ultimo.titulo === titulo) ultimo.lecciones.push(leccion);
    else bloques.push({ titulo, lecciones: [leccion] });
  }
  return bloques;
}

// Detalle de un curso publicado (spec F02 + F16): metadatos completos,
// atribución de fork, organización opcional, avance del alumno (F04) y temario
// agrupado por módulos cuando el autor los definió.
export default function DetalleCurso() {
  const c = useColores();
  const { idCurso } = useLocalSearchParams<{ idCurso: string }>();
  const { datos, cargando, error, recargar, recargarEnSilencio } = usePeticion(
    useCallback(() => traerCurso(idCurso), [idCurso]),
  );
  useRecargarAlVolver(recargarEnSilencio);

  function verCursos() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  function contenido() {
    if (cargando && !datos) return <IndicadorCarga />;
    if (esNoDisponible(error)) {
      return (
        <EstadoVacio
          icono={CircleSlash}
          titulo={MENSAJES_CATALOGO.cursoNoDisponible}
          anunciar
          accion={<Boton titulo="Ver cursos" variante="secundario" alPresionar={verCursos} />}
        />
      );
    }
    if (!datos) {
      return <ErrorCarga mensaje={leerErrorDeCarga(error)} alReintentar={recargar} />;
    }

    const { curso } = datos;
    const bloques = agruparPorModulo(curso.lecciones);

    return (
      <>
        {error ? (
          <View style={styles.errorRecarga}>
            <Aviso texto={leerErrorDeCarga(error)} />
            <View style={styles.reintentar}>
              <Boton
                titulo="Reintentar"
                variante="secundario"
                tamano="chico"
                alPresionar={recargar}
              />
            </View>
          </View>
        ) : null}

        <Superficie elevada style={styles.encabezado}>
          <PortadaCurso
            id={curso.id}
            titulo={curso.titulo}
            tamano="detalle"
            idPortada={curso.idPortada}
          />
          <View style={styles.datos}>
            <Texto variante="titulo2" accessibilityRole="header">
              {curso.titulo}
            </Texto>
            <Texto variante="cuerpoChico" color="primario" style={styles.autor}>
              Por {curso.autor.nombre}
            </Texto>
            {curso.cursoOrigen && (
              <View style={styles.origen}>
                <GitFork size={14} color={c.textoSuave} strokeWidth={2.25} />
                <Texto variante="nota" color="textoSuave">
                  Adaptado de «{curso.cursoOrigen.titulo}» ({curso.cursoOrigen.nombreAutor})
                </Texto>
              </View>
            )}
            <Texto variante="nota" color="textoSuave">
              Idioma: {NOMBRE_IDIOMA[curso.idioma]}
            </Texto>
            <View style={styles.etiquetas}>
              {curso.organizacion && (
                <Insignia tono="primario" icono={Building2} texto={curso.organizacion.nombre} />
              )}
              <Insignia
                tono="primario"
                icono={BookOpen}
                texto={textoCantidadLecciones(curso.cantidadLecciones)}
              />
              <Insignia texto={NOMBRE_CATEGORIA[curso.categoria]} />
              <Insignia texto={NOMBRE_NIVEL[curso.nivel]} />
              {curso.daInsignia && <Insignia tono="acento" icono={Award} texto="Da insignia" />}
            </View>
          </View>
        </Superficie>

        <Texto color="textoSuave">{curso.descripcion}</Texto>

        {curso.lecciones.length > 0 && <Avance curso={curso} />}

        <View style={styles.lecciones}>
          <Texto variante="seccion" color="textoSuave" accessibilityRole="header">
            Temario
          </Texto>
          {curso.lecciones.length === 0 ? (
            <EstadoVacio icono={NotebookPen} titulo="Este curso todavía no tiene lecciones." />
          ) : (
            <View style={styles.modulos}>
              {bloques.map((bloque, idxBloque) => (
                <View key={`${bloque.titulo ?? "unico"}-${idxBloque}`} style={styles.bloqueModulo}>
                  {bloque.titulo && (
                    <Texto variante="etiqueta" color="textoSuave" style={styles.tituloModulo}>
                      {bloque.titulo}
                    </Texto>
                  )}
                  <Superficie style={styles.lista}>
                    {bloque.lecciones.map((leccion, indice) => (
                      <FilaLeccion
                        key={leccion.id}
                        leccion={leccion}
                        primera={indice === 0}
                        alAbrir={() => abrirLeccion(curso.id, leccion.id)}
                      />
                    ))}
                  </Superficie>
                </View>
              ))}
            </View>
          )}
        </View>
      </>
    );
  }

  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.pantalla} edges={["top"]}>
        <View style={styles.barra}>
          <Boton
            titulo="Cursos"
            variante="enlace"
            tamano="chico"
            icono={ArrowLeft}
            alPresionar={verCursos}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.contenido}
          refreshControl={
            <RefreshControl
              refreshing={cargando && datos !== null}
              onRefresh={recargar}
              tintColor={c.primario}
              colors={[c.primario]}
            />
          }
        >
          {contenido()}
        </ScrollView>
      </SafeAreaView>
    </FondoAmbiental>
  );
}

type PropsFilaLeccion = {
  leccion: Curso["lecciones"][number];
  primera: boolean;
  alAbrir: () => void;
};

// Una lección de la lista; completada, con su marca y su resultado (docs/diseno.md,
// sección 5, "Lección completada en la lista"): un icono y el texto, no solo el color.
function FilaLeccion({ leccion, primera, alAbrir }: PropsFilaLeccion) {
  const c = useColores();
  const completada = leccion.progreso !== null;
  const aciertos = leccion.progreso ? textoAciertos(leccion.progreso) : null;
  const nombre = [
    `${leccion.posicion}. ${leccion.titulo}`,
    ...(completada ? ["completada"] : []),
    ...(aciertos ? [aciertos] : []),
  ].join(", ");

  return (
    <Pressable
      onPress={alAbrir}
      style={({ pressed }) => [
        styles.leccion,
        !primera && { borderTopWidth: 1, borderColor: c.borde },
        pressed && [styles.presionada, { backgroundColor: c.primarioSuave }],
      ]}
      accessibilityRole="button"
      accessibilityLabel={nombre}
    >
      <View
        style={[styles.numero, { backgroundColor: completada ? c.broteSuave : c.primarioSuave }]}
      >
        <Texto
          variante="etiqueta"
          color={completada ? "broteFuerte" : "primario"}
          style={styles.textoNumero}
        >
          {leccion.posicion}
        </Texto>
      </View>
      <Texto style={styles.tituloLeccion}>{leccion.titulo}</Texto>
      {completada && (
        <View style={styles.completada}>
          <CircleCheck size={20} color={c.broteFuerte} strokeWidth={2.25} />
          {aciertos && (
            <Texto variante="nota" color="textoSuave">
              {aciertos}
            </Texto>
          )}
        </View>
      )}
      <ChevronRight size={20} color={c.textoTenue} strokeWidth={2.25} />
    </Pressable>
  );
}

type PropsAvance = {
  curso: Curso;
};

function Avance({ curso }: PropsAvance) {
  const { completadas, total, siguiente } = avanceCurso(curso.lecciones);

  return (
    <Superficie style={styles.avance}>
      <AvanceCurso completadas={completadas} total={total} />
      {siguiente && (
        <Boton
          titulo={textoBotonSiguiente(siguiente, completadas)}
          iconoFinal={ArrowRight}
          alPresionar={() => abrirLeccion(curso.id, siguiente.id)}
        />
      )}
    </Superficie>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  barra: {
    flexDirection: "row",
    paddingHorizontal: MARGEN_PANTALLA - espacio[3],
  },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: espacio[3],
    paddingBottom: espacio[9],
    gap: espacio[7],
  },
  encabezado: {
    padding: espacio[6],
    gap: espacio[6],
    borderRadius: radio.enorme,
  },
  datos: {
    gap: espacio[3],
  },
  origen: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[2],
  },
  etiquetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio[2],
    paddingTop: espacio[2],
  },
  errorRecarga: {
    gap: espacio[4],
  },
  reintentar: {
    alignItems: "center",
  },
  avance: {
    padding: espacio[6],
    gap: espacio[5],
  },
  autor: {
    fontFamily: fuentes.seminegrita,
  },
  lecciones: {
    gap: espacio[4],
  },
  modulos: {
    gap: espacio[5],
  },
  bloqueModulo: {
    gap: espacio[3],
  },
  tituloModulo: {
    paddingHorizontal: espacio[2],
  },
  lista: {
    padding: espacio[3],
  },
  leccion: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[5],
    minHeight: 56,
    paddingVertical: espacio[3],
    paddingHorizontal: espacio[4],
  },
  numero: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textoNumero: {
    fontFamily: fuentes.negrita,
  },
  tituloLeccion: {
    flex: 1,
    fontFamily: fuentes.medio,
  },
  completada: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
  presionada: {
    borderRadius: radio.medio,
    transform: [{ scale: 0.98 }],
  },
});
