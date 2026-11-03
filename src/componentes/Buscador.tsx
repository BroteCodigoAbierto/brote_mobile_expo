import { Search, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
import { AREA_TACTIL, espacio, radio, tipografia } from "../constantes/tema";
import { useColores, useSombras } from "../hooks/useColores";
import { LIMITES_CATALOGO } from "../tipos/contrato";

type Props = {
  valor: string;
  alCambiar: (texto: string) => void;
  // hay una búsqueda en camino: la lista anterior sigue en pantalla
  buscando: boolean;
};

export default function Buscador({ valor, alCambiar, buscando }: Props) {
  const c = useColores();
  const s = useSombras();
  const [conFoco, setConFoco] = useState(false);

  return (
    <View
      style={[
        styles.control,
        {
          backgroundColor: c.vidrioOpaco,
          borderColor: conFoco ? c.primario : c.vidrioBorde,
          boxShadow: conFoco ? `${s.suave}, 0px 0px 0px 3px ${c.primarioSuave}` : s.suave,
        },
      ]}
    >
      <Search size={20} color={conFoco ? c.primario : c.textoTenue} strokeWidth={2} />
      <TextInput
        style={[styles.entrada, { color: c.texto }]}
        value={valor}
        onChangeText={alCambiar}
        onFocus={() => setConFoco(true)}
        onBlur={() => setConFoco(false)}
        placeholder="Busca por título, tema o autor"
        placeholderTextColor={c.textoTenue}
        selectionColor={c.primario}
        accessibilityLabel="Buscar cursos"
        maxLength={LIMITES_CATALOGO.busquedaMax}
        returnKeyType="search"
        autoCorrect={false}
        underlineColorAndroid="transparent"
      />
      {buscando && (
        <ActivityIndicator size="small" color={c.primario} accessibilityLabel="Buscando" />
      )}
      {valor !== "" && (
        <Pressable
          onPress={() => alCambiar("")}
          style={({ pressed }) => [styles.limpiar, pressed && { backgroundColor: c.primarioSuave }]}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
        >
          <X size={18} color={c.textoSuave} strokeWidth={2.25} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio[3],
    minHeight: 54,
    paddingLeft: espacio[6],
    paddingRight: espacio[2],
    borderWidth: 1,
    borderRadius: radio.pildora,
    borderCurve: "continuous",
  },
  entrada: {
    flex: 1,
    minHeight: AREA_TACTIL,
    paddingVertical: espacio[3],
    ...tipografia.cuerpo,
  },
  limpiar: {
    width: AREA_TACTIL,
    height: AREA_TACTIL,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: AREA_TACTIL / 2,
  },
});
