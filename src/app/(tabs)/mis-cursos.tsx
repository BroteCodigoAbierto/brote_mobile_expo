import { router } from "expo-router";
import { BookMarked } from "lucide-react-native";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Aviso from "../../componentes/Aviso";
import Boton from "../../componentes/Boton";
import ErrorCarga from "../../componentes/ErrorCarga";
import EstadoVacio from "../../componentes/EstadoVacio";
import FondoAmbiental from "../../componentes/FondoAmbiental";
import IndicadorCarga from "../../componentes/IndicadorCarga";
import TarjetaCurso from "../../componentes/TarjetaCurso";
import Texto from "../../componentes/Texto";
import { espacio, MARGEN_PANTALLA } from "../../constantes/tema";
import { useColores } from "../../hooks/useColores";
import { usePeticion } from "../../hooks/usePeticion";
import { useRecargarAlVolver } from "../../hooks/useRecargarAlVolver";
import { leerErrorDeCarga } from "../../servicios/cursos";
import { traerCursosEmpezados } from "../../servicios/progreso";

// "Mis cursos" (spec F04): los cursos que empezó el alumno, del avance más
// reciente al más antiguo. La pestaña queda montada, así que al volver a ella
// se recarga en silencio (research de F04, punto 8); deslizar hacia abajo
// recarga con el indicador. La parte de cursos descargados llega con F10.
export default function MisCursos() {
  const c = useColores();
  const { datos, cargando, error, recargar, recargarEnSilencio } =
    usePeticion(traerCursosEmpezados);
  useRecargarAlVolver(recargarEnSilencio);

  let cuerpo;
  if (cargando && !datos) cuerpo = <IndicadorCarga />;
  else if (!datos) {
    cuerpo = <ErrorCarga mensaje={leerErrorDeCarga(error)} alReintentar={recargar} />;
  } else {
    cuerpo = (
      <FlatList
        style={styles.lista}
        contentContainerStyle={styles.contenidoLista}
        data={datos.cursos}
        keyExtractor={(curso) => curso.id}
        renderItem={({ item }) => (
          <TarjetaCurso
            curso={item}
            avance={{ completadas: item.leccionesCompletadas, total: item.cantidadLecciones }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={cargando}
            onRefresh={recargar}
            tintColor={c.primario}
            colors={[c.primario]}
          />
        }
        // dentro de la lista, para que deslizar hacia abajo siga funcionando
        ListEmptyComponent={
          <EstadoVacio
            icono={BookMarked}
            titulo="Todavía no empiezas ningún curso."
            texto="Cuando completes tu primera lección, aquí verás tu avance."
            accion={
              <Boton
                titulo="Explorar cursos"
                variante="secundario"
                alPresionar={() => router.navigate("/")}
              />
            }
          />
        }
      />
    );
  }

  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.pantalla} edges={["top"]}>
        <Texto variante="titulo1" accessibilityRole="header">
          Mis cursos
        </Texto>
        {/* una recarga que falló con cursos en pantalla: se quedan */}
        {datos && error ? (
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
  errorRecarga: {
    gap: espacio[4],
  },
  reintentar: {
    alignItems: "center",
  },
  // la lista llega hasta los bordes para que la sombra de las tarjetas no se corte
  lista: {
    marginHorizontal: -MARGEN_PANTALLA,
  },
  contenidoLista: {
    flexGrow: 1,
    gap: espacio[5],
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: espacio[2],
    paddingBottom: espacio[8],
  },
});
