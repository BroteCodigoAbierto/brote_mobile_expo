import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, BookOpen, ChevronRight, CircleSlash, NotebookPen } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { esNoDisponible, leerErrorDeCarga, traerCurso } from "../../servicios/cursos";
import { MENSAJES_CATALOGO } from "../../tipos/contrato";
import { textoCantidadLecciones } from "../../utilidades/cursos";

// Detalle de un curso publicado (spec F02): sus datos y la lista de lecciones,
// que se abren para cursarlas (F03).
export default function DetalleCurso() {
  const c = useColores();
  const { idCurso } = useLocalSearchParams<{ idCurso: string }>();
  const { datos, cargando, error, recargar } = usePeticion(
    useCallback(() => traerCurso(idCurso), [idCurso]),
  );

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
    if (error || !datos) {
      return <ErrorCarga mensaje={leerErrorDeCarga(error)} alReintentar={recargar} />;
    }

    const { curso } = datos;
    return (
      <>
        <Superficie elevada style={styles.encabezado}>
          <PortadaCurso id={curso.id} titulo={curso.titulo} tamano="detalle" />
          <View style={styles.datos}>
            <Texto variante="titulo2" accessibilityRole="header">
              {curso.titulo}
            </Texto>
            <Texto variante="cuerpoChico" color="primario" style={styles.autor}>
              Por {curso.autor.nombre}
            </Texto>
            <Insignia
              tono="primario"
              icono={BookOpen}
              texto={textoCantidadLecciones(curso.cantidadLecciones)}
            />
          </View>
        </Superficie>

        <Texto color="textoSuave">{curso.descripcion}</Texto>

        <View style={styles.lecciones}>
          <Texto variante="seccion" color="textoSuave" accessibilityRole="header">
            Lecciones
          </Texto>
          {curso.lecciones.length === 0 ? (
            <EstadoVacio icono={NotebookPen} titulo="Este curso todavía no tiene lecciones." />
          ) : (
            <Superficie style={styles.lista}>
              {curso.lecciones.map((leccion, indice) => (
                <Pressable
                  key={leccion.id}
                  onPress={() =>
                    router.push({
                      pathname: "/leccion/[idCurso]/[idLeccion]",
                      params: { idCurso: curso.id, idLeccion: leccion.id },
                    })
                  }
                  style={({ pressed }) => [
                    styles.leccion,
                    indice > 0 && { borderTopWidth: 1, borderColor: c.borde },
                    pressed && [styles.presionada, { backgroundColor: c.primarioSuave }],
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${leccion.posicion}. ${leccion.titulo}`}
                >
                  <View style={[styles.numero, { backgroundColor: c.primarioSuave }]}>
                    <Texto variante="etiqueta" color="primario" style={styles.textoNumero}>
                      {leccion.posicion}
                    </Texto>
                  </View>
                  <Texto style={styles.tituloLeccion}>{leccion.titulo}</Texto>
                  <ChevronRight size={20} color={c.textoTenue} strokeWidth={2.25} />
                </Pressable>
              ))}
            </Superficie>
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
    gap: espacio[4],
  },
  autor: {
    fontFamily: fuentes.seminegrita,
  },
  lecciones: {
    gap: espacio[4],
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
  presionada: {
    borderRadius: radio.medio,
    transform: [{ scale: 0.98 }],
  },
});
