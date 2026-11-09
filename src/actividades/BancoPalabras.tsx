import { useState } from "react";
import { AccessibilityInfo, StyleSheet } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import ElementoRespuesta from "../componentes/ElementoRespuesta";
import LugarElemento from "../componentes/LugarElemento";
import Superficie from "../componentes/Superficie";
import Texto from "../componentes/Texto";
import TextoConEspacios from "../componentes/TextoConEspacios";
import ZonaElementos from "../componentes/ZonaElementos";
import { espacio } from "../constantes/tema";
import { CONSIGNA_POR_DEFECTO } from "../tipos/contrato";
import { mezclar } from "../utilidades/actividades";
import {
  colocarEnPrimerLibre,
  fichaCorrecta,
  lugaresVacios,
  primerLibre,
  quitarDeLugar,
  SIN_COLOCAR,
  solucionBanco,
  soltarEnLugares,
  textoConFichas,
  type Lugares,
} from "../utilidades/relacionar";
import Arrastrable from "./arrastre/Arrastrable";
import DestinoArrastre from "./arrastre/DestinoArrastre";
import { useArrastrarElemento } from "./arrastre/useArrastrarElemento";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Banco de palabras (spec F11): cada espacio del texto se llena con una ficha, y cada ficha se
// usa una sola vez. Se acierta solo si todos los espacios son correctos.
export default function BancoPalabras({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"bancoPalabras">) {
  const { fichas, espacios } = actividad;
  const [orden] = useState(() => mezclar(fichas.map((_, indice) => indice)));
  const [lugares, setLugares] = useState<Lugares>(() => lugaresVacios(espacios.length));
  const [comprobada, setComprobada] = useState(false);
  const completa = primerLibre(lugares) === -1;
  const acerto = lugares.every((ficha, espacioTexto) =>
    fichaCorrecta(actividad, ficha, espacioTexto),
  );
  const solucion = comprobada && !acerto ? solucionBanco(actividad, lugares) : [];

  const arrastre = useArrastrarElemento<number, number | typeof SIN_COLOCAR>({
    alSoltar: (item, destino) => cambiar(soltarEnLugares(lugares, item, destino), item),
  });

  function cambiar(nuevos: Lugares, ficha: number) {
    const lugar = nuevos.indexOf(ficha);
    const texto = fichas[ficha] ?? "";
    setLugares(nuevos);
    alInteractuar();
    AccessibilityInfo.announceForAccessibility(
      lugar === -1 ? `${texto} sin colocar` : `${texto} en el espacio ${lugar + 1}`,
    );
  }

  function pulsar(ficha: number) {
    if (comprobada || !arrastre.pulsoPermitido()) return;
    const colocada = lugares.includes(ficha);
    if (!colocada && completa) return;
    cambiar(colocada ? quitarDeLugar(lugares, ficha) : colocarEnPrimerLibre(lugares, ficha), ficha);
  }

  function dibujar(ficha: number, lugar: number | null) {
    const texto = fichas[ficha] ?? "";
    const correcta = lugar !== null && fichaCorrecta(actividad, ficha, lugar);
    const enEspacio = comprobada && lugar !== null;
    const partes = [
      texto,
      lugar !== null && `espacio ${lugar + 1}`,
      enEspacio && (correcta ? "correcto" : "incorrecto"),
    ];
    return (
      <Arrastrable
        key={ficha}
        arrastre={arrastre}
        item={ficha}
        texto={texto}
        forma="compacta"
        deshabilitado={comprobada}
      >
        <ElementoRespuesta
          texto={texto}
          forma="compacta"
          estado={enEspacio ? (correcta ? "correcta" : "incorrecta") : "normal"}
          atenuada={arrastre.item === ficha}
          deshabilitada={comprobada}
          etiqueta={partes.filter(Boolean).join(", ")}
          alPulsar={() => pulsar(ficha)}
        />
      </Arrastrable>
    );
  }

  function dibujarEspacio(lugar: number) {
    const ficha = lugares[lugar] ?? null;
    const correcta = fichaCorrecta(actividad, ficha, lugar);
    return (
      <DestinoArrastre arrastre={arrastre} destino={lugar} style={styles.espacio}>
        <LugarElemento
          enLinea
          estado={comprobada ? (correcta ? "correcto" : "incorrecto") : "normal"}
          esperada={comprobada && !correcta ? fichas[solucion[lugar] ?? -1] : undefined}
          resaltado={arrastre.destino === lugar}
          etiqueta={`Espacio ${lugar + 1}, vacío`}
        >
          {ficha === null ? undefined : dibujar(ficha, lugar)}
        </LugarElemento>
      </DestinoArrastre>
    );
  }

  const barra = comprobada ? (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      detalle={acerto ? undefined : textoConFichas(actividad, solucion)}
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
        {actividad.consigna ?? CONSIGNA_POR_DEFECTO.bancoPalabras}
      </Texto>
      <Superficie style={styles.panel}>
        <TextoConEspacios texto={actividad.texto} dibujarEspacio={dibujarEspacio} />
      </Superficie>
      <DestinoArrastre arrastre={arrastre} destino={SIN_COLOCAR}>
        <ZonaElementos etiqueta="Banco de fichas" resaltada={arrastre.destino === SIN_COLOCAR}>
          {orden.filter((ficha) => !lugares.includes(ficha)).map((ficha) => dibujar(ficha, null))}
        </ZonaElementos>
      </DestinoArrastre>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: espacio[2],
    padding: espacio[6],
  },
  // en una línea que se envuelve, una ficha larga no se sale del panel
  espacio: {
    maxWidth: "100%",
  },
});
