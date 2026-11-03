import { Library, SearchX } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Aviso from "../../componentes/Aviso";
import Boton from "../../componentes/Boton";
import Buscador from "../../componentes/Buscador";
import ErrorCarga from "../../componentes/ErrorCarga";
import EstadoVacio from "../../componentes/EstadoVacio";
import FondoAmbiental from "../../componentes/FondoAmbiental";
import IndicadorCarga from "../../componentes/IndicadorCarga";
import TarjetaCurso from "../../componentes/TarjetaCurso";
import Texto from "../../componentes/Texto";
import { espacio, MARGEN_PANTALLA } from "../../constantes/tema";
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

  let cuerpo;
  if (fase === "cargando") cuerpo = <IndicadorCarga />;
  else if (fase === "error") {
    cuerpo = mensajeError && <ErrorCarga mensaje={mensajeError} alReintentar={reintentar} />;
  } else {
    cuerpo = (
      <FlatList
        style={[styles.lista, buscando && styles.atenuada]}
        contentContainerStyle={styles.contenidoLista}
        data={cursos}
        keyExtractor={(curso) => curso.id}
        renderItem={({ item }) => <TarjetaCurso curso={item} />}
        // https://reactnative.dev/docs/flatlist
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={recargando}
            onRefresh={recargar}
            tintColor={c.primario}
            colors={[c.primario]}
          />
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // dentro de la lista, para que deslizar hacia abajo siga funcionando
        ListEmptyComponent={
          consulta === "" ? (
            <EstadoVacio
              icono={Library}
              titulo="Todavía no hay cursos publicados."
              texto="Cuando la comunidad publique sus primeros cursos, aparecerán aquí."
            />
          ) : (
            <EstadoVacio
              icono={SearchX}
              titulo={`No hay cursos que coincidan con «${consulta}».`}
              texto="Prueba con otra palabra o revisa cómo está escrita."
              accion={
                <Boton
                  titulo="Borrar búsqueda"
                  variante="secundario"
                  alPresionar={borrarBusqueda}
                />
              }
            />
          )
        }
        ListFooterComponent={
          cargandoMas ? (
            <IndicadorCarga tamano="chico" etiqueta="Cargando más cursos" />
          ) : errorMas && mensajeError ? (
            <ErrorCarga mensaje={mensajeError} alReintentar={reintentar} />
          ) : undefined
        }
      />
    );
  }

  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.pantalla} edges={["top"]}>
        <View style={styles.encabezado}>
          <Texto variante="titulo1" accessibilityRole="header">
            Explora cursos
          </Texto>
          <Texto variante="cuerpoChico" color="textoSuave">
            Lecciones cortas e interactivas, creadas por la comunidad.
          </Texto>
        </View>
        {buscador}
        {mensajeErrorRecarga && <Aviso texto={mensajeErrorRecarga} />}
        {cuerpo}
      </SafeAreaView>
    </FondoAmbiental>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    paddingTop: espacio[5],
    paddingHorizontal: MARGEN_PANTALLA,
    gap: espacio[5],
  },
  encabezado: {
    gap: espacio[2],
  },
  // la lista llega hasta los bordes para que la sombra de las tarjetas no se corte
  lista: {
    marginHorizontal: -MARGEN_PANTALLA,
  },
  contenidoLista: {
    gap: espacio[5],
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: espacio[2],
    paddingBottom: espacio[8],
  },
  // la lista anterior mientras llegan los resultados de la búsqueda nueva
  atenuada: {
    opacity: 0.55,
  },
});
