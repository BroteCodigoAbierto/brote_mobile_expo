import { Building2, KeyRound, LogOut, Medal, Palette } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Aviso from "../../componentes/Aviso";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import ErrorCarga from "../../componentes/ErrorCarga";
import EstadoVacio from "../../componentes/EstadoVacio";
import FondoAmbiental from "../../componentes/FondoAmbiental";
import IndicadorCarga from "../../componentes/IndicadorCarga";
import Insignia from "../../componentes/Insignia";
import InsigniaCurso from "../../componentes/InsigniaCurso";
import Superficie from "../../componentes/Superficie";
import Texto from "../../componentes/Texto";
import { coloresPortada, espacio, fuentes, MARGEN_PANTALLA, radio } from "../../constantes/tema";
import { useAspecto } from "../../hooks/useAspecto";
import { useColores } from "../../hooks/useColores";
import { usePeticion } from "../../hooks/usePeticion";
import { useRecargarAlVolver } from "../../hooks/useRecargarAlVolver";
import { useSesion } from "../../hooks/useSesion";
import { ErrorConexion, MENSAJE_SIN_CONEXION } from "../../servicios/api";
import { leerErrorDeCarga } from "../../servicios/cursos";
import { traerMisOrganizaciones, unirseAOrganizacion } from "../../servicios/organizaciones";
import { traerInsignias } from "../../servicios/progreso";
import type { InsigniaCurso as InsigniaDato, RolOrganizacion } from "../../tipos/contrato";
import { inicialPortada } from "../../utilidades/cursos";

const ETIQUETA_ROL: Record<RolOrganizacion, string> = {
  dueno: "Dueño",
  admin: "Admin",
  docente: "Docente",
  alumno: "Alumno",
};

// Nombre, correo, aspecto visual (Liquid Glass por defecto / Editorial opcional),
// espacios y escuelas (silo opcional), "Mis insignias" (F08) y "Cerrar sesión".
export default function Cuenta() {
  const c = useColores();
  const { variante, cambiarVariante } = useAspecto();
  const { usuario, cerrarSesion } = useSesion();
  const { datos, cargando, error, recargar, recargarEnSilencio } = usePeticion(traerInsignias);
  const {
    datos: datosOrgs,
    recargar: recargarOrgs,
    recargarEnSilencio: recargarOrgsEnSilencio,
  } = usePeticion(traerMisOrganizaciones);

  const [codigoOrg, setCodigoOrg] = useState("");
  const [uniendoOrg, setUniendoOrg] = useState(false);
  const [errorOrg, setErrorOrg] = useState<string | null>(null);
  const [exitoOrg, setExitoOrg] = useState<string | null>(null);

  const alVolver = useCallback(() => {
    recargarEnSilencio();
    recargarOrgsEnSilencio();
  }, [recargarEnSilencio, recargarOrgsEnSilencio]);
  useRecargarAlVolver(alVolver);

  function recargarTodo() {
    recargar();
    recargarOrgs();
  }

  async function manejarUnirseOrg() {
    const limpio = codigoOrg.trim();
    if (!limpio) {
      setErrorOrg("Escribe el código de invitación de la escuela u organización.");
      return;
    }
    setUniendoOrg(true);
    setErrorOrg(null);
    setExitoOrg(null);
    try {
      const { organizacion } = await unirseAOrganizacion(limpio);
      setCodigoOrg("");
      setExitoOrg(`Te uniste a «${organizacion.nombre}».`);
      recargarOrgs();
    } catch (err: unknown) {
      setErrorOrg(leerErrorDeCarga(err));
    } finally {
      setUniendoOrg(false);
    }
  }

  const organizaciones = datosOrgs?.organizaciones ?? [];

  return (
    <FondoAmbiental>
      <SafeAreaView style={styles.zona} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.pantalla}
          refreshControl={
            <RefreshControl
              refreshing={cargando && Boolean(datos)}
              onRefresh={recargarTodo}
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

          {/* Preferencia de aspecto visual: Liquid Glass es el diseño por defecto */}
          <View style={styles.seccion}>
            <Texto variante="seccion" color="textoSuave" accessibilityRole="header">
              Aspecto visual
            </Texto>
            <Superficie style={styles.bloqueAspecto}>
              <View style={styles.encabezadoAspecto}>
                <Palette size={18} color={c.primario} strokeWidth={2.25} />
                <Texto variante="cuerpoChico" color="textoSuave" style={styles.textoFlex}>
                  Liquid Glass es el diseño principal de Brote; Editorial ofrece tarjetas sólidas
                  con mayor contraste.
                </Texto>
              </View>
              <View
                style={[
                  styles.segmentado,
                  { backgroundColor: c.vidrioSuave, borderColor: c.borde },
                ]}
              >
                <Pressable
                  onPress={() => cambiarVariante("vidrio")}
                  accessibilityRole="button"
                  accessibilityState={{ selected: variante === "vidrio" }}
                  style={[
                    styles.opcionSegmento,
                    variante === "vidrio" && { backgroundColor: c.primario },
                  ]}
                >
                  <Texto
                    variante="etiqueta"
                    style={{ color: variante === "vidrio" ? c.sobrePrimario : c.textoSuave }}
                  >
                    Liquid Glass
                  </Texto>
                </Pressable>
                <Pressable
                  onPress={() => cambiarVariante("editorial")}
                  accessibilityRole="button"
                  accessibilityState={{ selected: variante === "editorial" }}
                  style={[
                    styles.opcionSegmento,
                    variante === "editorial" && { backgroundColor: c.primario },
                  ]}
                >
                  <Texto
                    variante="etiqueta"
                    style={{ color: variante === "editorial" ? c.sobrePrimario : c.textoSuave }}
                  >
                    Editorial
                  </Texto>
                </Pressable>
              </View>
            </Superficie>
          </View>

          {/* Silos opcionales: espacios y escuelas */}
          <View style={styles.seccion}>
            <Texto variante="seccion" color="textoSuave" accessibilityRole="header">
              Espacios y escuelas
            </Texto>
            {organizaciones.length > 0 && (
              <View style={styles.lista}>
                {organizaciones.map((org) => (
                  <Superficie key={org.id} style={styles.tarjetaOrg}>
                    <View style={styles.filaOrg}>
                      <Building2 size={18} color={c.primario} strokeWidth={2.25} />
                      <Texto variante="titulo3" style={styles.textoFlex}>
                        {org.nombre}
                      </Texto>
                      <Insignia tono="primario" texto={ETIQUETA_ROL[org.rol]} />
                    </View>
                    {org.descripcion ? (
                      <Texto variante="cuerpoChico" color="textoSuave">
                        {org.descripcion}
                      </Texto>
                    ) : null}
                  </Superficie>
                ))}
              </View>
            )}
            <Superficie style={styles.bloqueAspecto}>
              <CampoTexto
                etiqueta="Unirme a una organización con código"
                valor={codigoOrg}
                alCambiar={setCodigoOrg}
                icono={KeyRound}
                placeholder="Código de invitación"
                autoCapitalize="characters"
                alEnviar={() => void manejarUnirseOrg()}
                error={errorOrg ?? undefined}
                ayuda="Opcional. Si tu escuela o equipo usa Brote, escribe aquí su código."
              />
              {exitoOrg && <Aviso tono="exito" texto={exitoOrg} />}
              <Boton
                titulo="Unirme al espacio"
                variante="secundario"
                tamano="chico"
                enviando={uniendoOrg}
                alPresionar={() => void manejarUnirseOrg()}
              />
            </Superficie>
          </View>

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
  insignias: InsigniaDato[] | null;
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
  bloqueAspecto: {
    padding: espacio[5],
    gap: espacio[4],
  },
  encabezadoAspecto: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacio[3],
  },
  textoFlex: {
    flex: 1,
  },
  segmentado: {
    flexDirection: "row",
    padding: espacio[1],
    borderRadius: radio.pildora,
    borderWidth: 1,
    gap: espacio[1],
  },
  opcionSegmento: {
    flex: 1,
    minHeight: 40,
    borderRadius: radio.pildora,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espacio[4],
  },
  tarjetaOrg: {
    padding: espacio[5],
    gap: espacio[2],
  },
  filaOrg: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
  },
  lista: {
    gap: espacio[4],
  },
});
