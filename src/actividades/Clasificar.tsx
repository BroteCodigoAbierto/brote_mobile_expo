import { useState } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import ElementoRespuesta from "../componentes/ElementoRespuesta";
import type { EstadoOpcion } from "../componentes/OpcionRespuesta";
import Texto from "../componentes/Texto";
import ZonaElementos from "../componentes/ZonaElementos";
import { espacio } from "../constantes/tema";
import { CONSIGNA_POR_DEFECTO } from "../tipos/contrato";
import { mezclar } from "../utilidades/actividades";
import {
  detalleClasificar,
  pulsarCategoria,
  pulsarElementoClasificar,
  SIN_COLOCAR,
  soltarEnClasificar,
  type EstadoClasificar,
} from "../utilidades/relacionar";
import Arrastrable from "./arrastre/Arrastrable";
import DestinoArrastre from "./arrastre/DestinoArrastre";
import { useArrastrarElemento } from "./arrastre/useArrastrarElemento";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Clasificar (spec F11): cada elemento va en una categoría, pulsando o arrastrando. Se acierta
// solo si todos están en la suya.
export default function Clasificar({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"clasificar">) {
  const { categorias, elementos } = actividad;
  const [orden] = useState(() => mezclar(elementos.map((_, indice) => indice)));
  const [estado, setEstado] = useState<EstadoClasificar>({
    categoriaDe: elementos.map(() => null),
    seleccion: null,
  });
  const [comprobada, setComprobada] = useState(false);
  const { categoriaDe, seleccion } = estado;
  const completa = categoriaDe.every((categoria) => categoria !== null);
  const acerto = elementos.every(({ categoria }, indice) => categoriaDe[indice] === categoria);

  const arrastre = useArrastrarElemento<number, number | typeof SIN_COLOCAR>({
    alEmpezar: () => setEstado((antes) => ({ ...antes, seleccion: null })),
    alSoltar: (item, destino) =>
      cambiar({ categoriaDe: soltarEnClasificar(categoriaDe, item, destino), seleccion: null }),
  });

  function textoDe(indice: number): string {
    return elementos[indice]?.texto ?? "";
  }

  function anuncioDe(nuevo: EstadoClasificar): string {
    const movido = nuevo.categoriaDe.findIndex((categoria, i) => categoria !== categoriaDe[i]);
    if (movido === -1) {
      return nuevo.seleccion === null ? "" : `${textoDe(nuevo.seleccion)}, seleccionado`;
    }
    const categoria = nuevo.categoriaDe[movido] ?? null;
    if (categoria === null) return `${textoDe(movido)} sin colocar`;
    return `${textoDe(movido)} en ${categorias[categoria] ?? ""}`;
  }

  function cambiar(nuevo: EstadoClasificar) {
    const anuncio = anuncioDe(nuevo);
    setEstado(nuevo);
    alInteractuar();
    if (anuncio) AccessibilityInfo.announceForAccessibility(anuncio);
  }

  function pulsar(nuevo: EstadoClasificar) {
    if (!comprobada && arrastre.pulsoPermitido()) cambiar(nuevo);
  }

  function estadoDe(indice: number): EstadoOpcion {
    if (comprobada) {
      return categoriaDe[indice] === elementos[indice]?.categoria ? "correcta" : "incorrecta";
    }
    return seleccion === indice ? "seleccionada" : "normal";
  }

  function etiquetaDe(indice: number): string {
    const categoria = categoriaDe[indice] ?? null;
    const estadoElemento = estadoDe(indice);
    return [
      textoDe(indice),
      estadoElemento === "seleccionada" && "seleccionado",
      categoria !== null && `en ${categorias[categoria] ?? ""}`,
      estadoElemento === "correcta" && "correcto",
      estadoElemento === "incorrecta" && "incorrecto",
    ]
      .filter(Boolean)
      .join(", ");
  }

  function dibujar(indice: number) {
    const texto = textoDe(indice);
    return (
      <Arrastrable
        key={indice}
        arrastre={arrastre}
        item={indice}
        texto={texto}
        forma="compacta"
        deshabilitado={comprobada}
      >
        <ElementoRespuesta
          texto={texto}
          forma="compacta"
          estado={estadoDe(indice)}
          atenuada={arrastre.item === indice}
          deshabilitada={comprobada}
          etiqueta={etiquetaDe(indice)}
          alPulsar={() => pulsar(pulsarElementoClasificar(estado, indice))}
        />
      </Arrastrable>
    );
  }

  const barra = comprobada ? (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      detalle={acerto ? undefined : detalleClasificar(actividad, categoriaDe)}
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
        {actividad.consigna ?? CONSIGNA_POR_DEFECTO.clasificar}
      </Texto>
      <DestinoArrastre arrastre={arrastre} destino={SIN_COLOCAR}>
        <ZonaElementos
          etiqueta="Elementos sin colocar"
          resaltada={arrastre.destino === SIN_COLOCAR}
        >
          {orden.filter((indice) => categoriaDe[indice] === null).map(dibujar)}
        </ZonaElementos>
      </DestinoArrastre>
      <View style={styles.categorias}>
        {categorias.map((nombre, categoria) => (
          <DestinoArrastre key={nombre} arrastre={arrastre} destino={categoria}>
            <ZonaElementos
              titulo={nombre}
              etiqueta={`Categoría ${nombre}`}
              resaltada={arrastre.destino === categoria}
              alPulsar={comprobada ? undefined : () => pulsar(pulsarCategoria(estado, categoria))}
            >
              {orden.filter((indice) => categoriaDe[indice] === categoria).map(dibujar)}
            </ZonaElementos>
          </DestinoArrastre>
        ))}
      </View>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  categorias: {
    gap: espacio[4],
  },
});
