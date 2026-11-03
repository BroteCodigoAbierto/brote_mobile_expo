import { RotateCw } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import TarjetaVolteable from "../componentes/TarjetaVolteable";
import Texto from "../componentes/Texto";
import { espacio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Tarjeta de memoria (spec F03): se voltea las veces que quiera; "Continuar"
// se habilita al voltearla por primera vez. No se califica.
export default function TarjetaMemoria({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"tarjeta">) {
  const c = useColores();
  const [volteada, setVolteada] = useState(false);
  const [yaVolteada, setYaVolteada] = useState(false);

  function voltear() {
    setVolteada((antes) => !antes);
    if (!yaVolteada) {
      setYaVolteada(true);
      alInteractuar();
    }
  }

  return (
    <MarcoActividad
      barra={
        <BarraRespuesta
          estado="neutro"
          textoBoton="Continuar"
          deshabilitado={!yaVolteada}
          alPulsar={() => alTerminar("sinCalificar")}
        />
      }
    >
      <TarjetaVolteable
        frente={actividad.frente}
        reverso={actividad.reverso}
        volteada={volteada}
        alVoltear={voltear}
      />
      {!yaVolteada && (
        <View style={styles.indicacion}>
          <RotateCw size={16} color={c.textoSuave} strokeWidth={2.25} />
          <Texto variante="nota" color="textoSuave">
            Toca la tarjeta para voltearla
          </Texto>
        </View>
      )}
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  indicacion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espacio[3],
  },
});
