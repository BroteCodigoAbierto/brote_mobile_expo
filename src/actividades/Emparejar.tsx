import { useState } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import BarraRespuesta from "../componentes/BarraRespuesta";
import ElementoRespuesta from "../componentes/ElementoRespuesta";
import type { EstadoOpcion } from "../componentes/OpcionRespuesta";
import Texto from "../componentes/Texto";
import { espacio } from "../constantes/tema";
import { CONSIGNA_POR_DEFECTO } from "../tipos/contrato";
import {
  claveDe,
  detalleParejas,
  elementoDe,
  esParejaCorrecta,
  mezclarSinResolver,
  parejaDe,
  pulsarEnEmparejar,
  unirElementos,
  type ElementoPareja,
  type EstadoEmparejar,
  type Lado,
} from "../utilidades/relacionar";
import Arrastrable from "./arrastre/Arrastrable";
import DestinoArrastre from "./arrastre/DestinoArrastre";
import { useArrastrarElemento } from "./arrastre/useArrastrarElemento";
import MarcoActividad from "./MarcoActividad";
import type { PropsActividad } from "./tipos";

// Emparejar (spec F11): dos columnas, y cada elemento de la izquierda se une con uno de la
// derecha, pulsando o arrastrando. Se acierta solo si todas las parejas son correctas.
export default function Emparejar({
  actividad,
  alInteractuar,
  alTerminar,
}: PropsActividad<"emparejar">) {
  const { parejas } = actividad;
  const [ordenDerecha] = useState(() => mezclarSinResolver(parejas.length));
  const [estado, setEstado] = useState<EstadoEmparejar>({ parejas: [], seleccion: null });
  const [comprobada, setComprobada] = useState(false);
  const { parejas: formadas, seleccion } = estado;
  const completa = formadas.length === parejas.length;
  const acerto = comprobada && formadas.every(esParejaCorrecta);

  const arrastre = useArrastrarElemento<string, string>({
    alEmpezar: () => setEstado((antes) => ({ ...antes, seleccion: null })),
    acepta: (item, destino) => elementoDe(item).lado !== elementoDe(destino).lado,
    alSoltar: (item, destino) => {
      const uno = elementoDe(item);
      cambiar({ parejas: unirElementos(formadas, uno, elementoDe(destino)), seleccion: null }, uno);
    },
  });

  function textoDe({ lado, indice }: ElementoPareja): string {
    return parejas[indice]?.[lado] ?? "";
  }

  function anuncioDe(nuevo: EstadoEmparejar, elemento: ElementoPareja): string {
    const nueva = nuevo.parejas.find((pareja) => !formadas.includes(pareja));
    if (nueva) {
      const izquierda = textoDe({ lado: "izquierda", indice: nueva.izquierda });
      const derecha = textoDe({ lado: "derecha", indice: nueva.derecha });
      return `Pareja ${nueva.numero}: ${izquierda} con ${derecha}`;
    }
    if (nuevo.parejas.length < formadas.length) return `${textoDe(elemento)} sin colocar`;
    if (nuevo.seleccion) return `${textoDe(nuevo.seleccion)}, seleccionado`;
    return `${textoDe(elemento)}, sin seleccionar`;
  }

  function cambiar(nuevo: EstadoEmparejar, elemento: ElementoPareja) {
    setEstado(nuevo);
    alInteractuar();
    AccessibilityInfo.announceForAccessibility(anuncioDe(nuevo, elemento));
  }

  function pulsar(elemento: ElementoPareja) {
    if (comprobada || !arrastre.pulsoPermitido()) return;
    cambiar(pulsarEnEmparejar(estado, elemento), elemento);
  }

  function estadoDe(elemento: ElementoPareja): EstadoOpcion {
    const pareja = parejaDe(formadas, elemento);
    if (comprobada) return pareja && esParejaCorrecta(pareja) ? "correcta" : "incorrecta";
    const elegido = seleccion?.lado === elemento.lado && seleccion.indice === elemento.indice;
    return elegido ? "seleccionada" : "normal";
  }

  function etiquetaDe(elemento: ElementoPareja): string {
    const pareja = parejaDe(formadas, elemento);
    const estadoElemento = estadoDe(elemento);
    return [
      textoDe(elemento),
      estadoElemento === "seleccionada" && "seleccionado",
      pareja && `pareja ${pareja.numero}`,
      estadoElemento === "correcta" && "correcto",
      estadoElemento === "incorrecta" && "incorrecto",
    ]
      .filter(Boolean)
      .join(", ");
  }

  function dibujar(lado: Lado, indice: number) {
    const elemento = { lado, indice };
    const clave = claveDe(elemento);
    const texto = textoDe(elemento);
    return (
      <DestinoArrastre key={clave} arrastre={arrastre} destino={clave}>
        <Arrastrable
          arrastre={arrastre}
          item={clave}
          texto={texto}
          forma="tarjeta"
          deshabilitado={comprobada}
        >
          <ElementoRespuesta
            texto={texto}
            estado={estadoDe(elemento)}
            marca={parejaDe(formadas, elemento)?.numero}
            atenuada={arrastre.item === clave}
            resaltada={arrastre.destino === clave}
            deshabilitada={comprobada}
            etiqueta={etiquetaDe(elemento)}
            alPulsar={() => pulsar(elemento)}
          />
        </Arrastrable>
      </DestinoArrastre>
    );
  }

  const barra = comprobada ? (
    <BarraRespuesta
      estado={acerto ? "correcto" : "incorrecto"}
      titulo={acerto ? "¡Correcto!" : "Respuesta correcta:"}
      detalle={acerto ? undefined : detalleParejas(actividad, formadas)}
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
        {actividad.consigna ?? CONSIGNA_POR_DEFECTO.emparejar}
      </Texto>
      <View style={styles.columnas}>
        <View style={styles.columna}>{parejas.map((_, i) => dibujar("izquierda", i))}</View>
        <View style={styles.columna}>{ordenDerecha.map((i) => dibujar("derecha", i))}</View>
      </View>
    </MarcoActividad>
  );
}

const styles = StyleSheet.create({
  columnas: {
    flexDirection: "row",
    gap: espacio[4],
  },
  columna: {
    flex: 1,
    gap: espacio[4],
  },
});
