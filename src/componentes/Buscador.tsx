import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { espacio, radio } from "../constantes/tema";
import { useColores } from "../hooks/useColores";
import { LIMITES_CATALOGO } from "../tipos/contrato";

type Props = {
  valor: string;
  alCambiar: (texto: string) => void;
  // hay una búsqueda en camino: la lista anterior sigue en pantalla
  buscando: boolean;
};

export default function Buscador({ valor, alCambiar, buscando }: Props) {
  const c = useColores();

  return (
    <View style={[styles.control, { backgroundColor: c.superficie, borderColor: c.borde }]}>
      <TextInput
        style={[styles.entrada, { color: c.texto }]}
        value={valor}
        onChangeText={alCambiar}
        placeholder="Buscar cursos"
        placeholderTextColor={c.textoSuave}
        accessibilityLabel="Buscar cursos"
        maxLength={LIMITES_CATALOGO.busquedaMax}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {buscando && (
        <ActivityIndicator
          size="small"
          color={c.primario}
          style={styles.indicador}
          accessibilityLabel="Buscando"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radio,
  },
  entrada: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  indicador: {
    marginRight: espacio.tres,
  },
});
