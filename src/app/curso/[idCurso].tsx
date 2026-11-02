import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Boton from "../../componentes/Boton";
import ErrorCarga from "../../componentes/ErrorCarga";
import PortadaCurso from "../../componentes/PortadaCurso";
import { espacio, radio } from "../../constantes/tema";
import { useColores } from "../../hooks/useColores";
import { usePeticion } from "../../hooks/usePeticion";
import { esNoDisponible, leerErrorDeCarga, traerCurso } from "../../servicios/cursos";
import { MENSAJES_CATALOGO } from "../../tipos/contrato";
import { textoCantidadLecciones } from "../../utilidades/cursos";

// Detalle de un curso publicado (spec F02): sus datos y la lista de lecciones.
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
    if (cargando && !datos) {
      return (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={c.primario} accessibilityLabel="Cargando" />
        </View>
      );
    }
    if (esNoDisponible(error)) {
      return (
        <View style={styles.noDisponible}>
          <Text style={[styles.aviso, { color: c.texto }]} accessibilityRole="alert">
            {MENSAJES_CATALOGO.cursoNoDisponible}
          </Text>
          <Boton titulo="Ver cursos" variante="secundario" alPresionar={verCursos} />
        </View>
      );
    }
    if (error || !datos) {
      return <ErrorCarga mensaje={leerErrorDeCarga(error)} alReintentar={recargar} />;
    }

    const { curso } = datos;
    return (
      <>
        <View style={styles.encabezado}>
          <PortadaCurso id={curso.id} titulo={curso.titulo} tamano="detalle" />
          <View style={styles.datos}>
            <Text style={[styles.titulo, { color: c.texto }]} accessibilityRole="header">
              {curso.titulo}
            </Text>
            <Text style={[styles.suave, { color: c.textoSuave }]}>Por {curso.autor.nombre}</Text>
            <Text style={[styles.suave, { color: c.textoSuave }]}>
              {textoCantidadLecciones(curso.cantidadLecciones)}
            </Text>
          </View>
        </View>

        <Text style={[styles.descripcion, { color: c.texto }]}>{curso.descripcion}</Text>

        {curso.lecciones.length === 0 ? (
          <Text style={[styles.suave, { color: c.textoSuave }]}>
            Este curso todavía no tiene lecciones.
          </Text>
        ) : (
          <View style={[styles.lista, { backgroundColor: c.superficie, borderColor: c.borde }]}>
            {curso.lecciones.map((leccion, indice) => (
              <Text
                key={leccion.id}
                style={[
                  styles.leccion,
                  { color: c.texto, borderColor: c.borde },
                  indice > 0 && styles.separada,
                ]}
              >
                {leccion.posicion}. {leccion.titulo}
              </Text>
            ))}
          </View>
        )}
      </>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.pantalla}
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
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flexGrow: 1,
    padding: espacio.tres,
    gap: espacio.cuatro,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noDisponible: {
    alignItems: "center",
    gap: espacio.tres,
    paddingVertical: espacio.cuatro,
  },
  aviso: {
    fontSize: 16,
    textAlign: "center",
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio.tres,
  },
  datos: {
    flex: 1,
    gap: espacio.uno,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
  },
  suave: {
    fontSize: 15,
  },
  descripcion: {
    fontSize: 16,
    lineHeight: 23,
  },
  lista: {
    borderWidth: 1,
    borderRadius: radio,
  },
  leccion: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: espacio.tres,
  },
  separada: {
    borderTopWidth: 1,
  },
});
