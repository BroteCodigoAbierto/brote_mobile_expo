import { useState } from "react";
import { Keyboard } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import PanelTerminal from "../componentes/PanelTerminal";
import Texto from "../componentes/Texto";
import { comandoAceptado } from "../utilidades/codigo";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Terminal simulada (spec F12): escribe un comando y la tecla de enviar (o "Comprobar") lo
// compara con los aceptados. Un solo intento. No se ejecuta nada: si falla, la terminal no
// inventa una salida, y la barra muestra el primer comando aceptado y la pista.
export default function TerminalSimulada({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"terminalSimulada">) {
  const [comando, setComando] = useState("");
  const [acerto, setAcerto] = useState<boolean | null>(null);
  const comprobada = acerto !== null;

  function escribir(valor: string) {
    setComando(valor);
    alInteractuar();
  }

  function comprobar() {
    if (comprobada || comando.trim() === "") return;
    // al pulsar "Comprobar" el teclado sigue abierto (keyboardShouldPersistTaps="handled")
    Keyboard.dismiss();
    setAcerto(comandoAceptado(comando, actividad.comandos));
  }

  let barra;
  if (!comprobada) {
    barra = (
      <BarraRespuesta
        estado="neutro"
        textoBoton="Comprobar"
        deshabilitado={comando.trim() === ""}
        alPulsar={comprobar}
      />
    );
  } else if (acerto) {
    barra = (
      <BarraRespuesta
        estado="correcto"
        titulo="¡Correcto!"
        textoBoton="Continuar"
        alPulsar={() => alTerminar("acierto")}
      />
    );
  } else {
    barra = (
      <BarraRespuesta
        estado="incorrecto"
        titulo="Respuesta correcta:"
        codigo={actividad.comandos[0]}
        detalle={actividad.pista}
        textoBoton="Continuar"
        alPulsar={() => alTerminar("fallo")}
      />
    );
  }

  return (
    <MarcoActividad barra={barra}>
      <Texto variante="titulo2" accessibilityRole="header">
        {actividad.consigna}
      </Texto>
      <PanelTerminal
        salidaPrevia={actividad.salidaPrevia}
        carpeta={actividad.carpeta}
        comando={comando}
        alCambiar={escribir}
        alEnviar={comprobar}
        soloLectura={comprobada}
        salida={acerto ? actividad.salidaAcierto : undefined}
      />
    </MarcoActividad>
  );
}
