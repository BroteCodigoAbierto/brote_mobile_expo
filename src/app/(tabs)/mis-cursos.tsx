import { router } from "expo-router";
import { BookMarked, ChevronRight, KeyRound, Users } from "lucide-react-native";
import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Aviso from "../../componentes/Aviso";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import ErrorCarga from "../../componentes/ErrorCarga";
import EstadoVacio from "../../componentes/EstadoVacio";
import FondoAmbiental from "../../componentes/FondoAmbiental";
import IndicadorCarga from "../../componentes/IndicadorCarga";
import Insignia from "../../componentes/Insignia";
import Superficie from "../../componentes/Superficie";
import TarjetaCurso from "../../componentes/TarjetaCurso";
import Texto from "../../componentes/Texto";
import { espacio, MARGEN_PANTALLA, radio } from "../../constantes/tema";
import { useColores } from "../../hooks/useColores";
import { usePeticion } from "../../hooks/usePeticion";
import { useRecargarAlVolver } from "../../hooks/useRecargarAlVolver";
import { leerErrorDeCarga } from "../../servicios/cursos";
import { traerMisGrupos, unirseAGrupo } from "../../servicios/grupos";
import { traerCursosEmpezados } from "../../servicios/progreso";

// "Mis cursos" (spec F04 + F16): cursos empezados y sección de aulas/grupos
// donde el alumno puede ver sus grupos o unirse con un código de aula.
export default function MisCursos() {
  const c = useColores();
  const { datos, cargando, error, recargar, recargarEnSilencio } =
    usePeticion(traerCursosEmpezados);
  const {
    datos: datosGrupos,
    recargar: recargarGrupos,
    recargarEnSilencio: recargarGruposEnSilencio,
  } = usePeticion(traerMisGrupos);

  const [codigoGrupo, setCodigoGrupo] = useState("");
  const [uniendo, setUniendo] = useState(false);
  const [errorGrupo, setErrorGrupo] = useState<string | null>(null);
  const [exitoGrupo, setExitoGrupo] = useState<string | null>(null);

  const alVolver = useCallback(() => {
    recargarEnSilencio();
    recargarGruposEnSilencio();
  }, [recargarEnSilencio, recargarGruposEnSilencio]);
  useRecargarAlVolver(alVolver);

  function recargarTodo() {
    recargar();
    recargarGrupos();
  }

  async function manejarUnirseGrupo() {
    const limpio = codigoGrupo.trim();
    if (!limpio) {
      setErrorGrupo("Escribe el código de tu aula.");
      return;
    }
    setUniendo(true);
    setErrorGrupo(null);
    setExitoGrupo(null);
    try {
      const { grupo } = await unirseAGrupo(limpio);
      setCodigoGrupo("");
      setExitoGrupo(`Te uniste a «${grupo.nombre}».`);
      recargarGrupos();
    } catch (err: unknown) {
      setErrorGrupo(leerErrorDeCarga(err));
    } finally {
      setUniendo(false);
    }
  }

  const grupos = datosGrupos?.grupos ?? [];

  const seccionAulas = (
    <View style={styles.seccionAulas}>
      <Texto variante="seccion" color="textoSuave" accessibilityRole="header">
        Mis aulas y grupos
      </Texto>
      {grupos.length > 0 && (
        <View style={styles.listaAulas}>
          {grupos.map((grupo) => (
            <Pressable
              key={grupo.id}
              onPress={() =>
                router.push({ pathname: "/curso/[idCurso]", params: { idCurso: grupo.idCurso } })
              }
              accessibilityRole="button"
              style={({ pressed }) => pressed && styles.presionada}
            >
              <Superficie style={styles.tarjetaAula}>
                <View style={styles.datosAula}>
                  <Texto variante="titulo3">{grupo.nombre}</Texto>
                  <Texto variante="cuerpoChico" color="textoSuave">
                    {grupo.tituloCurso} · Docente: {grupo.nombreDocente}
                  </Texto>
                  <View style={styles.etiquetasAula}>
                    <Insignia icono={Users} texto={`${grupo.cantidadAlumnos} participantes`} />
                    {grupo.organizacion && (
                      <Insignia tono="primario" texto={grupo.organizacion.nombre} />
                    )}
                  </View>
                </View>
                <ChevronRight size={20} color={c.textoTenue} strokeWidth={2.25} />
              </Superficie>
            </Pressable>
          ))}
        </View>
      )}
      <Superficie style={styles.formularioAula}>
        <CampoTexto
          etiqueta="Unirme a un aula con código"
          valor={codigoGrupo}
          alCambiar={setCodigoGrupo}
          icono={KeyRound}
          placeholder="Ej. AULA-4K9P"
          autoCapitalize="characters"
          alEnviar={() => void manejarUnirseGrupo()}
          error={errorGrupo ?? undefined}
        />
        {exitoGrupo && <Aviso tono="exito" texto={exitoGrupo} />}
        <Boton
          titulo="Unirme al aula"
          variante="secundario"
          tamano="chico"
          enviando={uniendo}
          alPresionar={() => void manejarUnirseGrupo()}
        />
      </Superficie>
    </View>
  );

  let cuerpo;
  if (cargando && !datos) cuerpo = <IndicadorCarga />;
  else if (!datos) {
    cuerpo = <ErrorCarga mensaje={leerErrorDeCarga(error)} alReintentar={recargarTodo} />;
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
            onRefresh={recargarTodo}
            tintColor={c.primario}
            colors={[c.primario]}
          />
        }
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
        ListFooterComponent={seccionAulas}
      />
    );
  }

  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.pantalla} edges={["top"]}>
        <Texto variante="titulo1" accessibilityRole="header">
          Mis cursos
        </Texto>
        {datos && error ? (
          <View style={styles.errorRecarga}>
            <Aviso texto={leerErrorDeCarga(error)} />
            <View style={styles.reintentar}>
              <Boton
                titulo="Reintentar"
                variante="secundario"
                tamano="chico"
                alPresionar={recargarTodo}
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
  seccionAulas: {
    gap: espacio[4],
    paddingTop: espacio[5],
  },
  listaAulas: {
    gap: espacio[4],
  },
  tarjetaAula: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[4],
    padding: espacio[5],
    borderRadius: radio.grande,
  },
  datosAula: {
    flex: 1,
    gap: espacio[2],
  },
  etiquetasAula: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio[2],
    paddingTop: espacio[1],
  },
  formularioAula: {
    padding: espacio[5],
    gap: espacio[4],
  },
  presionada: {
    opacity: 0.9,
  },
});
