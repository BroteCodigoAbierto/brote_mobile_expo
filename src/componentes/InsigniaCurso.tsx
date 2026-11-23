import { Medal } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { espacio, fuentes, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import type { InsigniaCurso as Insignia } from "../tipos/contrato";
import PortadaCurso from "./PortadaCurso";
import Texto from "./Texto";

type Props = {
  insignia: Insignia;
  tamano: "lista" | "grande";
};

const TAMANOS = { lista: 64, grande: 96 } as const;
// PortadaCurso "detalle" mide 120; se escala para llenar el círculo con su inicial a escala
const LADO_PORTADA = 120;
const BORDE = 3;

const FECHA = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" });

// La insignia de un curso completado (spec F08; docs/diseno.md, sección 4): la portada del
// curso en un círculo con una medalla. Si la portada no carga, PortadaCurso pone la
// generada. En "lista" va con el título y la fecha; en "grande", sola.
export default function InsigniaCurso({ insignia, tamano }: Props) {
  const c = useColores();
  const lado = TAMANOS[tamano];
  const interior = lado - BORDE * 2;
  const escala = interior / LADO_PORTADA;
  const medalla = Math.round(lado * 0.4);

  const circulo = (
    <View
      style={{ width: lado, height: lado }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Insignia de ${insignia.titulo}`}
    >
      <View
        style={[
          styles.circulo,
          { width: lado, height: lado, borderColor: c.acento, borderWidth: BORDE },
        ]}
      >
        <View
          style={{
            position: "absolute",
            left: (interior - LADO_PORTADA) / 2,
            top: (interior - LADO_PORTADA) / 2,
            transform: [{ scale: escala }],
          }}
        >
          <PortadaCurso
            id={insignia.idCurso}
            titulo={insignia.titulo}
            tamano="detalle"
            idPortada={insignia.idPortada}
          />
        </View>
      </View>
      <View
        style={[styles.medalla, { width: medalla, height: medalla, backgroundColor: c.acento }]}
      >
        <Medal size={Math.round(medalla * 0.62)} color={c.sobrePrimario} strokeWidth={2.25} />
      </View>
    </View>
  );

  if (tamano === "grande") return circulo;
  return (
    <View style={styles.fila}>
      {circulo}
      <View style={styles.textos}>
        <Texto variante="cuerpo" style={styles.titulo} numberOfLines={2}>
          {insignia.titulo}
        </Texto>
        <Texto variante="nota" color="textoSuave">
          Ganada el {FECHA.format(new Date(insignia.ganadaEn))}
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    borderRadius: radio.pildora,
    overflow: "hidden",
  },
  medalla: {
    position: "absolute",
    right: -2,
    bottom: -2,
    borderRadius: radio.pildora,
    alignItems: "center",
    justifyContent: "center",
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[4],
  },
  textos: {
    flex: 1,
    gap: espacio[1],
  },
  titulo: {
    fontFamily: fuentes.seminegrita,
  },
});
