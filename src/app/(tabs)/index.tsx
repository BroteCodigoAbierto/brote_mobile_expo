import { Building2, Globe, Library, SearchX } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
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
import { espacio, fuentes, MARGEN_PANTALLA, radio } from "../../constantes/tema";
import { useCatalogo } from "../../hooks/useCatalogo";
import { useColores } from "../../hooks/useColores";
import { useRecargarAlVolver } from "../../hooks/useRecargarAlVolver";
import type { FiltrosCatalogo } from "../../servicios/cursos";
import { traerMisOrganizaciones } from "../../servicios/organizaciones";
import {
  CATEGORIAS_CURSO,
  NIVELES_CURSO,
  NOMBRE_CATEGORIA,
  NOMBRE_NIVEL,
  type CategoriaCurso,
  type NivelCurso,
  type OrdenCatalogo,
  type OrganizacionPropia,
} from "../../tipos/contrato";

// Se busca cuando se deja de escribir, no con cada letra.
const ESPERA_BUSQUEDA_MS = 300;

const ETIQUETA_ORDEN: Record<OrdenCatalogo, string> = {
  recientes: "Recientes",
  destacados: "Destacados",
  az: "A–Z",
};

// Catálogo de cursos publicados (spec F02 + F16): buscador, categorías, nivel,
// orden, ocultar completados y selector opcional de espacios solo si el usuario
// pertenece a alguna organización.
export default function Explorar() {
  const c = useColores();
  const {
    filtros,
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
    recargarEnSilencio,
  } = useCatalogo();

  const [texto, setTexto] = useState("");
  const [textoEnviado, setTextoEnviado] = useState("");
  const [categoria, setCategoria] = useState<CategoriaCurso | undefined>(undefined);
  const [nivel, setNivel] = useState<NivelCurso | undefined>(undefined);
  const [orden, setOrden] = useState<OrdenCatalogo>("recientes");
  const [ocultarCompletados, setOcultarCompletados] = useState(false);
  const [espacio, setEspacio] = useState<string | undefined>(undefined);
  const [organizaciones, setOrganizaciones] = useState<OrganizacionPropia[]>([]);

  const cargarOrganizaciones = useCallback(() => {
    void traerMisOrganizaciones()
      .then((res) => setOrganizaciones(res.organizaciones))
      .catch(() => {});
  }, []);

  useEffect(() => {
    cargarOrganizaciones();
  }, [cargarOrganizaciones]);

  const alVolver = useCallback(() => {
    recargarEnSilencio();
    cargarOrganizaciones();
  }, [recargarEnSilencio, cargarOrganizaciones]);
  useRecargarAlVolver(alVolver);

  // Debounce solo del texto escrito
  useEffect(() => {
    const temporizador = setTimeout(() => setTextoEnviado(texto.trim()), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [texto]);

  const filtrosActivos: FiltrosCatalogo = useMemo(
    () => ({
      q: textoEnviado,
      categoria,
      nivel,
      orden,
      ocultarCompletados,
      organizacion: espacio,
    }),
    [textoEnviado, categoria, nivel, orden, ocultarCompletados, espacio],
  );

  useEffect(() => {
    buscar(filtrosActivos);
  }, [filtrosActivos, buscar]);

  function limpiarFiltros() {
    setTexto("");
    setTextoEnviado("");
    setCategoria(undefined);
    setNivel(undefined);
    setOrden("recientes");
    setOcultarCompletados(false);
  }

  function alternarOrden() {
    setOrden((actual) =>
      actual === "recientes" ? "destacados" : actual === "destacados" ? "az" : "recientes",
    );
  }

  function alternarNivel() {
    setNivel((actual) => {
      if (!actual) return NIVELES_CURSO[0];
      const idx = NIVELES_CURSO.indexOf(actual);
      return idx >= 0 && idx + 1 < NIVELES_CURSO.length ? NIVELES_CURSO[idx + 1] : undefined;
    });
  }

  const hayFiltros = Boolean(
    (filtros?.q ?? "") !== "" ||
    filtros?.categoria ||
    filtros?.nivel ||
    filtros?.ocultarCompletados,
  );
  const orgActiva = organizaciones.find((o) => o.slug === espacio) ?? null;

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
        ListEmptyComponent={
          hayFiltros ? (
            <EstadoVacio
              icono={SearchX}
              titulo={
                filtros?.q
                  ? `No hay cursos que coincidan con «${filtros.q}».`
                  : "Ningún curso coincide con estos filtros."
              }
              texto="Prueba con otra categoría, nivel o término de búsqueda."
              accion={
                <Boton
                  titulo="Limpiar filtros"
                  variante="secundario"
                  alPresionar={limpiarFiltros}
                />
              }
            />
          ) : (
            <EstadoVacio
              icono={Library}
              titulo={
                orgActiva
                  ? `Todavía no hay cursos publicados en ${orgActiva.nombre}.`
                  : "No hay cursos por explorar."
              }
              texto="Cuando la comunidad publique más cursos, aparecerán aquí."
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
            {orgActiva ? orgActiva.nombre : "Explora cursos"}
          </Texto>
          <Texto variante="cuerpoChico" color="textoSuave">
            {orgActiva
              ? orgActiva.descripcion || "Cursos del espacio de tu organización."
              : "Lecciones cortas e interactivas, creadas por la comunidad."}
          </Texto>
        </View>

        {/* Silo opcional: solo aparece si el usuario pertenece al menos a una organización */}
        {organizaciones.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carrusel}
            contentContainerStyle={styles.contenidoCarrusel}
          >
            <ChipFiltro
              etiqueta="Comunidad"
              activo={!espacio}
              icono={Globe}
              alPresionar={() => setEspacio(undefined)}
            />
            {organizaciones.map((org) => (
              <ChipFiltro
                key={org.id}
                etiqueta={org.nombre}
                activo={espacio === org.slug}
                icono={Building2}
                alPresionar={() => setEspacio(org.slug)}
              />
            ))}
          </ScrollView>
        )}

        <Buscador valor={texto} alCambiar={setTexto} buscando={buscando} />

        {/* Categorías y filtros rápidos */}
        <View style={styles.bloqueFiltros}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carrusel}
            contentContainerStyle={styles.contenidoCarrusel}
          >
            <ChipFiltro
              etiqueta="Todas"
              activo={!categoria}
              alPresionar={() => setCategoria(undefined)}
            />
            {CATEGORIAS_CURSO.map((cat) => (
              <ChipFiltro
                key={cat}
                etiqueta={NOMBRE_CATEGORIA[cat]}
                activo={categoria === cat}
                alPresionar={() => setCategoria((actual) => (actual === cat ? undefined : cat))}
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carrusel}
            contentContainerStyle={styles.contenidoCarrusel}
          >
            <ChipFiltro
              etiqueta={`Orden: ${ETIQUETA_ORDEN[orden]}`}
              activo={orden !== "recientes"}
              alPresionar={alternarOrden}
            />
            <ChipFiltro
              etiqueta={nivel ? `Nivel: ${NOMBRE_NIVEL[nivel]}` : "Nivel: Todos"}
              activo={Boolean(nivel)}
              alPresionar={alternarNivel}
            />
            <ChipFiltro
              etiqueta="Ocultar completados"
              activo={ocultarCompletados}
              alPresionar={() => setOcultarCompletados((v) => !v)}
            />
          </ScrollView>
        </View>

        {mensajeErrorRecarga && <Aviso texto={mensajeErrorRecarga} />}
        {cuerpo}
      </SafeAreaView>
    </FondoAmbiental>
  );
}

type PropsChipFiltro = {
  etiqueta: string;
  activo: boolean;
  icono?: typeof Globe;
  alPresionar: () => void;
};

function ChipFiltro({ etiqueta, activo, icono: Icono, alPresionar }: PropsChipFiltro) {
  const c = useColores();
  return (
    <Pressable
      onPress={alPresionar}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: activo ? c.primario : c.vidrioSuave,
          borderColor: activo ? c.primario : c.borde,
        },
        pressed && styles.chipPresionado,
      ]}
    >
      {Icono && (
        <Icono size={14} color={activo ? c.sobrePrimario : c.textoSuave} strokeWidth={2.25} />
      )}
      <Texto
        variante="nota"
        style={[styles.textoChip, { color: activo ? c.sobrePrimario : c.textoSuave }]}
      >
        {etiqueta}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    paddingTop: espacio[5],
    paddingHorizontal: MARGEN_PANTALLA,
    gap: espacio[4],
  },
  encabezado: {
    gap: espacio[2],
  },
  bloqueFiltros: {
    gap: espacio[3],
  },
  carrusel: {
    marginHorizontal: -MARGEN_PANTALLA,
    flexGrow: 0,
  },
  contenidoCarrusel: {
    paddingHorizontal: MARGEN_PANTALLA,
    gap: espacio[3],
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[2],
    minHeight: 34,
    paddingHorizontal: espacio[4],
    borderRadius: radio.pildora,
    borderWidth: 1,
  },
  chipPresionado: {
    opacity: 0.85,
  },
  textoChip: {
    fontFamily: fuentes.seminegrita,
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
