import { useState } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import ElementoRespuesta from "../componentes/ElementoRespuesta";
import LugarElemento from "../componentes/LugarElemento";
import Texto from "../componentes/Texto";
import ZonaElementos from "../componentes/ZonaElementos";
import { espacio } from "../constantes/tema";
import {
  colocarEnPrimerLibre,
  detalleOrdenar,
  lugaresVacios,
  mezclarSinResolver,
  primerLibre,
  quitarDeLugar,
  SIN_COLOCAR,
  soltarEnLugares,
  type Lugares,
} from "../utilidades/relacionar";
import Arrastrable from "./arrastre/Arrastrable";
import DestinoArrastre from "./arrastre/DestinoArrastre";
import { useArrastrarElemento } from "./arrastre/useArrastrarElemento";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Ordenar (spec F11): se llenan los lugares numerados, pulsando cada elemento o arrastrándolo a
// un lugar en concreto. Se acierta solo si todos quedan en su lugar.
export default function Ordenar({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"ordenar">) {
  const { elementos } = actividad;
  const [orden] = useState(() => mezclarSinResolver(elementos.length));
  const [lugares, setLugares] = useState<Lugares>(() => lugaresVacios(elementos.length));
  const [comprobada, setComprobada] = useState(false);
  const completa = primerLibre(lugares) === -1;
  const acerto = lugares.every((elemento, lugar) => elemento === lugar);

  const arrastre = useArrastrarElemento<number, number | typeof SIN_COLOCAR>({
    alSoltar: (item, destino) => cambiar(soltarEnLugares(lugares, item, destino), item),
  });

  function cambiar(nuevos: Lugares, elemento: number) {
    const lugar = nuevos.indexOf(elemento);
    const texto = elementos[elemento] ?? "";
    setLugares(nuevos);
    alInteractuar();
    AccessibilityInfo.announceForAccessibility(
      lugar === -1 ? `${texto} sin colocar` : `${texto} en el lugar ${lugar + 1}`,
    );
  }

  function pulsar(elemento: number) {
    if (comprobada || !arrastre.pulsoPermitido()) return;
    const colocado = lugares.includes(elemento);
    cambiar(
      colocado ? quitarDeLugar(lugares, elemento) : colocarEnPrimerLibre(lugares, elemento),
      elemento,
    );
  }

  function dibujar(elemento: number, lugar: number | null) {
    const texto = elementos[elemento] ?? "";
    const correcto = elemento === lugar;
    const partes = [
      texto,
      lugar !== null && `lugar ${lugar + 1}`,
      comprobada && (correcto ? "correcto" : "incorrecto"),
    ];
    return (
      <Arrastrable
        key={elemento}
        arrastre={arrastre}
        item={elemento}
        texto={texto}
        forma="tarjeta"
        deshabilitado={comprobada}
      >
        <ElementoRespuesta
          texto={texto}
          estado={comprobada ? (correcto ? "correcta" : "incorrecta") : "normal"}
          atenuada={arrastre.item === elemento}
          deshabilitada={comprobada}
          etiqueta={partes.filter(Boolean).join(", ")}
          alPulsar={() => pulsar(elemento)}
        />
      </Arrastrable>
    );
  }

  const barra = comprobada ? (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      detalle={acerto ? undefined : detalleOrdenar(actividad)}
      textoBoton="Continuar"
      alPulsar={() => alTerminar(acerto ? "acierto" : "fallo")}
    />
  ) : (
    <BarraRespuesta
      estado="neutro"
      textoBoton="Comprobar"
      deshabilitado={!completa}
      alPulsar={() => setComprobada(true)}
    />
  );

  return (
    <MarcoActividad barra={barra} arrastre={arrastre}>
      <Texto variante="titulo2" accessibilityRole="header">
        {actividad.consigna}
      </Texto>
      <View style={styles.lugares}>
        {lugares.map((elemento, lugar) => (
          <DestinoArrastre key={lugar} arrastre={arrastre} destino={lugar}>
            <LugarElemento
              numero={lugar + 1}
              estado={comprobada ? (elemento === lugar ? "correcto" : "incorrecto") : "normal"}
              resaltado={arrastre.destino === lugar}
              etiqueta={`Lugar ${lugar + 1}, vacío`}
            >
              {elemento === null ? undefined : dibujar(elemento, lugar)}
            </LugarElemento>
          </DestinoArrastre>
        ))}
      </View>
      <DestinoArrastre arrastre={arrastre} destino={SIN_COLOCAR}>
        <ZonaElementos
          etiqueta="Elementos sin colocar"
          resaltada={arrastre.destino === SIN_COLOCAR}
        >
          {orden.filter((elemento) => !lugares.includes(elemento)).map((e) => dibujar(e, null))}
        </ZonaElementos>
      </DestinoArrastre>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  lugares: {
    gap: espacio[3],
  },
});
