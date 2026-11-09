import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Aviso from "../componentes/Aviso";
import BarraRespuesta from "../componentes/BarraRespuesta";
import Boton from "../componentes/Boton";
import BotonEscuchar from "../componentes/BotonEscuchar";
import BotonGrabar from "../componentes/BotonGrabar";
import EstadoAudio from "../componentes/EstadoAudio";
import FraseEscuchar from "../componentes/FraseEscuchar";
import Superficie from "../componentes/Superficie";
import Texto from "../componentes/Texto";
import { espacio } from "../constantes/tema";
import { useAudios } from "../contextos/ContextoAudios";
import { useIdioma } from "../contextos/ContextoIdioma";
import { useFrase, type EstadoFrase, type VelocidadFrase } from "../hooks/useFrase";
import { useGrabacion, type EstadoGrabacion } from "../hooks/useGrabacion";
import {
  CONSIGNA_ESCUCHAR_REPETIR,
  MENSAJES_AUDIOS,
  NOMBRE_IDIOMA,
  type IdiomaCurso,
} from "../tipos/contrato";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Cuando la frase no se puede oír, "Comprobar" se habilita y la frase se ve (spec F14).
const NO_SE_OYE: EstadoFrase[] = ["noCargo", "sinVoz", "noSono"];

function avisoDeFrase(estado: EstadoFrase, idioma: IdiomaCurso): string | null {
  if (estado === "sinVoz") {
    return MENSAJES_AUDIOS.sinVoz.replace("{idioma}", NOMBRE_IDIOMA[idioma].toLowerCase());
  }
  return estado === "noSono" ? MENSAJES_AUDIOS.noSono : null;
}

function avisoDeGrabacion(estado: EstadoGrabacion): string | null {
  if (estado === "sinPermiso") {
    return `${MENSAJES_AUDIOS.sinPermiso}\n${MENSAJES_AUDIOS.permitirMovil}`;
  }
  return estado === "sinMicrofono" ? MENSAJES_AUDIOS.sinMicrofono : null;
}

// Escuchar y repetir (spec F14; docs/diseno.md, sección 6), como en la web: oye la frase (su
// audio o la voz del teléfono, en el idioma del curso), la dice, se graba si quiere y se
// autoevalúa. Nunca suenan dos cosas a la vez. Escuchar y grabarse no cuentan como haber hecho
// algo; comprobar, sí.
export default function EscucharRepetir({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"escucharRepetir">) {
  const idioma = useIdioma();
  const frase = useFrase(actividad, idioma, useAudios());
  const grabacion = useGrabacion();
  const [sePuedeComprobar, setSePuedeComprobar] = useState(false);
  const [aLaVista, setALaVista] = useState(actividad.mostrarTexto);
  const [comprobada, setComprobada] = useState(false);
  const [loDijoBien, setLoDijoBien] = useState<boolean | null>(null);

  // Las dos se quedan así: la frase no se vuelve a ocultar aunque el audio llegue después.
  const noSeOye = NO_SE_OYE.includes(frase.estado);
  if (!sePuedeComprobar && (frase.sono || noSeOye)) setSePuedeComprobar(true);
  if (!aLaVista && (comprobada || noSeOye)) setALaVista(true);

  const grabando = grabacion.estado === "grabando" || grabacion.estado === "pidiendoPermiso";
  const avisoFrase = avisoDeFrase(frase.estado, idioma);
  const avisoGrabacion = avisoDeGrabacion(grabacion.estado);

  function escuchar(velocidad: VelocidadFrase) {
    if (frase.estado === "sonando" && frase.velocidad === velocidad) {
      frase.detener();
      return;
    }
    grabacion.detenerEscucha();
    frase.escuchar(velocidad);
  }

  // mientras graba no suena nada, para que el modelo no quede en la grabación
  function grabar() {
    if (grabacion.estado === "grabando") {
      grabacion.detener();
      return;
    }
    frase.detener();
    grabacion.grabar();
  }

  function escucharGrabacion() {
    if (grabacion.estado === "sonando") {
      grabacion.detenerEscucha();
      return;
    }
    frase.detener();
    grabacion.escuchar();
  }

  function comprobar() {
    if (!sePuedeComprobar) return;
    setComprobada(true);
    alInteractuar();
  }

  function botonEscuchar(velocidad: VelocidadFrase) {
    return (
      <BotonEscuchar
        velocidad={velocidad}
        sonando={frase.estado === "sonando" && frase.velocidad === velocidad}
        cargando={frase.estado === "cargando"}
        deshabilitado={grabando || frase.estado === "sinVoz"}
        alPulsar={() => escuchar(velocidad)}
      />
    );
  }

  // mientras se autoevalúa no hay "Continuar": la acción son sus dos botones
  let barra = null;
  if (!comprobada) {
    barra = (
      <BarraRespuesta
        estado="neutro"
        textoBoton="Comprobar"
        deshabilitado={!sePuedeComprobar}
        alPulsar={comprobar}
      />
    );
  } else if (loDijoBien !== null) {
    barra = (
      <BarraRespuesta
        estado={loDijoBien ? "correcto" : "incorrecto"}
        titulo={loDijoBien ? "¡Correcto!" : "A repasar"}
        textoBoton="Continuar"
        alPulsar={() => alTerminar(loDijoBien ? "acierto" : "fallo")}
      />
    );
  }

  return (
    <MarcoActividad barra={barra}>
      <Texto variante="titulo2" accessibilityRole="header">
        {CONSIGNA_ESCUCHAR_REPETIR}
      </Texto>
      <Superficie style={styles.panel}>
        <FraseEscuchar frase={actividad.frase} idioma={idioma} oculta={!aLaVista} />
        <View style={styles.botones}>
          {botonEscuchar("normal")}
          {botonEscuchar("lenta")}
        </View>
        {frase.estado === "noCargo" && <EstadoAudio />}
      </Superficie>
      {avisoFrase && <Aviso tono="info" texto={avisoFrase} />}
      {avisoGrabacion && (
        <Aviso
          tono="info"
          texto={avisoGrabacion}
          accion={
            grabacion.puedeAbrirAjustes && (
              <Boton
                titulo="Abrir ajustes"
                variante="secundario"
                tamano="chico"
                alPresionar={grabacion.abrirAjustes}
              />
            )
          }
        />
      )}
      <View style={styles.grabar}>
        <BotonGrabar
          estado={
            grabacion.estado === "grabando"
              ? "grabando"
              : grabacion.hayGrabacion
                ? "conGrabacion"
                : "listo"
          }
          segundos={grabacion.segundos}
          deshabilitado={grabacion.estado === "pidiendoPermiso"}
          alPulsar={grabar}
        />
        {grabacion.hayGrabacion && !grabando && (
          <BotonEscuchar
            etiqueta="Escuchar mi grabación"
            sonando={grabacion.estado === "sonando"}
            alPulsar={escucharGrabacion}
          />
        )}
      </View>
      {comprobada && loDijoBien === null && (
        <View style={styles.autoevaluacion}>
          <Texto variante="titulo3">¿Lo dijiste bien?</Texto>
          <View style={styles.fila}>
            <Boton
              titulo="Lo dije bien"
              variante="secundario"
              alPresionar={() => setLoDijoBien(true)}
            />
            <Boton
              titulo="No me salió"
              variante="secundario"
              alPresionar={() => setLoDijoBien(false)}
            />
          </View>
        </View>
      )}
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: "center",
    gap: espacio[5],
    padding: espacio[6],
  },
  botones: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: espacio[4],
  },
  grabar: {
    gap: espacio[4],
  },
  autoevaluacion: {
    gap: espacio[4],
  },
  fila: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio[4],
  },
});
