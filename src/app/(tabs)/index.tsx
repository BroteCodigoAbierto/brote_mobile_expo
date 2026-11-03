import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import Boton from "../../componentes/Boton";
import Buscador from "../../componentes/Buscador";
import ErrorCarga from "../../componentes/ErrorCarga";
import MensajeFormulario from "../../componentes/MensajeFormulario";
import TarjetaCurso from "../../componentes/TarjetaCurso";
import { espacio } from "../../constantes/tema";
import { useCatalogo } from "../../hooks/useCatalogo";
import { useColores } from "../../hooks/useColores";

// Se busca cuando se deja de escribir, no con cada letra.
const ESPERA_BUSQUEDA_MS = 300;

// Catálogo de cursos publicados (spec F02): buscador, lista de 10 en 10 al
// llegar al final y deslizar hacia abajo para recargar.
export default function Explorar() {
  const c = useColores();
  const {
    consulta,
    cursos,
    fase,
    buscando,
    cargandoMas,
    errorMas,
    recargando,
    mensajeError,
    mensajeErrorRecarga,
    buscar,
    cargarMas,
    reintentar,
    recargar,
  } = useCatalogo();
  const [texto, setTexto] = useState("");

  // al abrir, el catálogo completo sin esperar
  useEffect(() => {
    buscar("");
  }, [buscar]);

  useEffect(() => {
    const temporizador = setTimeout(() => buscar(texto.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [texto, buscar]);

  function borrarBusqueda() {
    setTexto("");
    buscar("");
  }

  const catalogoVacio = fase === "listo" && consulta === "" && cursos.length === 0;
  // en la primera carga el buscador no aparece (podría no haber cursos); si ya
  // se vio, sigue ahí para no perder lo que se está escribiendo
  const conBuscador = fase === "cargando" ? consulta !== null || texto !== "" : !catalogoVacio;
  const buscador = conBuscador && (
    <Buscador valor={texto} alCambiar={setTexto} buscando={buscando} />
  );

  if (fase === "cargando") {
    return (
      <View style={styles.pantalla}>
        {buscador}
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={c.primario} accessibilityLabel="Cargando" />
        </View>
      </View>
    );
  }

  if (fase === "error") {
    return (
      <View style={styles.pantalla}>
        {buscador}
        {mensajeError && <ErrorCarga mensaje={mensajeError} alReintentar={reintentar} />}
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      {buscador}
      {mensajeErrorRecarga && <MensajeFormulario texto={mensajeErrorRecarga} />}
      <FlatList
        style={buscando && styles.atenuada}
        contentContainerStyle={styles.lista}
        data={cursos}
        keyExtractor={(curso) => curso.id}
        renderItem={({ item }) => <TarjetaCurso curso={item} />}
        // https://reactnative.dev/docs/flatlist
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5}
        refreshing={recargando}
        onRefresh={recargar}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // dentro de la lista, para que deslizar hacia abajo siga funcionando
        ListEmptyComponent={
          consulta === "" ? (
            <Text style={[styles.aviso, { color: c.textoSuave }]}>
              Todavía no hay cursos publicados.
            </Text>
          ) : (
            <View style={styles.sinResultados}>
              <Text style={[styles.aviso, { color: c.textoSuave }]}>
                No hay cursos que coincidan con «{consulta}».
              </Text>
              <Boton titulo="Borrar búsqueda" variante="secundario" alPresionar={borrarBusqueda} />
            </View>
          )
        }
        ListFooterComponent={
          cargandoMas ? (
            <ActivityIndicator
              style={styles.pie}
              color={c.primario}
              accessibilityLabel="Cargando más cursos"
            />
          ) : errorMas && mensajeError ? (
            <ErrorCarga mensaje={mensajeError} alReintentar={reintentar} />
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    paddingTop: espacio.tres,
    paddingHorizontal: espacio.tres,
    gap: espacio.tres,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lista: {
    gap: espacio.tres,
    paddingBottom: espacio.cuatro,
  },
  // la lista anterior mientras llegan los resultados de la búsqueda nueva
  atenuada: {
    opacity: 0.5,
  },
  aviso: {
    fontSize: 15,
    textAlign: "center",
    paddingVertical: espacio.cuatro,
  },
  sinResultados: {
    alignItems: "center",
  },
  pie: {
    paddingVertical: espacio.cuatro,
  },
});
