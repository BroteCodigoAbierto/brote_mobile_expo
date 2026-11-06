import { useState } from "react";
import BarraRespuesta from "../componentes/BarraRespuesta";
import DiagramaCommits from "../componentes/DiagramaCommits";
import Texto from "../componentes/Texto";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Grafo de commits (spec F12): elige un commit, como una opción, y al comprobar se marcan el
// correcto y, si eligió otro, el suyo.
export default function GrafoCommits({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"grafoCommits">) {
  const [elegido, setElegido] = useState<number | null>(null);
  const [comprobado, setComprobado] = useState(false);
  const acerto = elegido === actividad.respuesta;

  function elegir(indice: number) {
    if (comprobado) return;
    setElegido(indice);
    alInteractuar();
  }

  const barra = !comprobado ? (
    <BarraRespuesta
      estado="neutro"
      textoBoton="Comprobar"
      deshabilitado={elegido === null}
      alPulsar={() => {
        if (elegido !== null) setComprobado(true);
      }}
    />
  ) : (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      codigo={acerto ? undefined : actividad.commits[actividad.respuesta].nombre}
      detalle={actividad.explicacion}
      textoBoton="Continuar"
      alPulsar={() => alTerminar(acerto ? "acierto" : "fallo")}
    />
  );

  return (
    <MarcoActividad barra={barra}>
      <Texto variante="titulo2" accessibilityRole="header">
        {actividad.consigna}
      </Texto>
      <DiagramaCommits
        actividad={actividad}
        elegido={elegido}
        comprobado={comprobado}
        alElegir={elegir}
      />
    </MarcoActividad>
  );
}
