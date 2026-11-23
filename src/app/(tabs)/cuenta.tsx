import { LogOut, Medal } from "lucide-react-native";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Boton from "../../componentes/Boton";
import ErrorCarga from "../../componentes/ErrorCarga";
import EstadoVacio from "../../componentes/EstadoVacio";
import FondoAmbiental from "../../componentes/FondoAmbiental";
import IndicadorCarga from "../../componentes/IndicadorCarga";
import InsigniaCurso from "../../componentes/InsigniaCurso";
import Superficie from "../../componentes/Superficie";
import Texto from "../../componentes/Texto";
import { coloresPortada, espacio, fuentes, MARGEN_PANTALLA, radio } from "../../constantes/tema";
import { useColores } from "../../hooks/useColores";
import { usePeticion } from "../../hooks/usePeticion";
import { useRecargarAlVolver } from "../../hooks/useRecargarAlVolver";
import { useSesion } from "../../hooks/useSesion";
import { ErrorConexion, MENSAJE_SIN_CONEXION } from "../../servicios/api";
import { traerInsignias } from "../../servicios/progreso";
import type { InsigniaCurso as Insignia } from "../../tipos/contrato";
import { inicialPortada } from "../../utilidades/cursos";

// Nombre, correo, "Mis insignias" (F08) y "Cerrar sesión". Cerrar sesión solo afecta a este
// dispositivo y lleva a "Entrar" (Stack.Protected cambia de pantalla solo). La pestaña queda
// montada: al volver a ella las insignias se recargan en silencio, como "Mis cursos".
export default function Cuenta() {
  const c = useColores();
  const { usuario, cerrarSesion } = useSesion();
  const { datos, cargando, error, recargar, recargarEnSilencio } = usePeticion(traerInsignias);
  useRecargarAlVolver(recargarEnSilencio);

  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.zona} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.pantalla}
          refreshControl={
            <RefreshControl
              refreshing={cargando && Boolean(datos)}
              onRefresh={recargar}
              tintColor={c.primario}
              colors={[c.primario]}
            />
          }
        >
          <Texto variante="titulo1" accessibilityRole="header">
            Cuenta
          </Texto>
          <Superficie elevada style={styles.tarjeta}>
            <View style={styles.avatar} importantForAccessibility="no-hide-descendants">
              <Texto variante="titulo2" style={styles.inicial}>
                {inicialPortada(usuario?.nombre ?? "")}
              </Texto>
            </View>
            <View style={styles.datos}>
              <Texto variante="titulo3">{usuario?.nombre}</Texto>
              <Texto variante="cuerpoChico" color="textoSuave">
                {usuario?.correo}
              </Texto>
            </View>
          </Superficie>
          <View style={styles.seccion}>
            <Texto variante="seccion" color="textoSuave" accessibilityRole="header">
              Mis insignias
            </Texto>
            <ContenidoMisInsignias
              insignias={datos?.insignias ?? null}
              cargando={cargando && !datos}
              error={error}
              alReintentar={recargar}
            />
          </View>
          <Boton
            titulo="Cerrar sesión"
            variante="peligro"
            icono={LogOut}
            alPresionar={cerrarSesion}
          />
        </ScrollView>
      </SafeAreaView>
    </FondoAmbiental>
  );
}

type PropsContenido = {
  insignias: Insignia[] | null;
  cargando: boolean;
  error: unknown;
  alReintentar: () => void;
};

// F08: sus estados son propios; si fallan, el resto de la pestaña sigue (spec F08).
function ContenidoMisInsignias({ insignias, cargando, error, alReintentar }: PropsContenido) {
  if (cargando) return <IndicadorCarga />;
  if (!insignias) {
    const mensaje =
      error instanceof ErrorConexion && error.sinConexion
        ? MENSAJE_SIN_CONEXION
        : "No se pudieron cargar tus insignias.";
    return <ErrorCarga mensaje={mensaje} alReintentar={alReintentar} />;
  }
  if (insignias.length === 0) {
    return (
      <EstadoVacio
        icono={Medal}
        titulo="Todavía no tienes insignias"
        texto="Completa un curso que dé insignia para ganar la primera."
      />
    );
  }
  return (
    <View style={styles.lista}>
      {insignias.map((insignia) => (
        <InsigniaCurso key={insignia.idCurso} insignia={insignia} tamano="lista" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  zona: {
    flex: 1,
  },
  pantalla: {
    flexGrow: 1,
    paddingTop: espacio[5],
    paddingBottom: espacio[8],
    paddingHorizontal: MARGEN_PANTALLA,
    gap: espacio[7],
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[5],
    padding: espacio[6],
    borderRadius: radio.enorme,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    experimental_backgroundImage: `linear-gradient(135deg, ${coloresPortada[0]}, ${coloresPortada[1]})`,
  },
  inicial: {
    color: "#FFFFFF",
    fontFamily: fuentes.extranegrita,
  },
  datos: {
    flex: 1,
    gap: espacio[1],
  },
  seccion: {
    gap: espacio[4],
  },
  lista: {
    gap: espacio[5],
  },
});
