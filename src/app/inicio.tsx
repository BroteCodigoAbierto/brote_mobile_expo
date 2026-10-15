import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarraProgreso from "../componentes/BarraProgreso";
import TarjetaCurso from "../componentes/TarjetaCurso";
import { colores, radio } from "../constantes/tema";
import { cursos, progresoDe, usuarioDemo } from "../datos/cursos";

// Dashboard: saludo, el curso que el usuario está llevando y la lista de cursos.
export default function Inicio() {
  // el curso "en progreso" es el primero que tiene algo hecho pero no está terminado
  const cursoActual = cursos.find((c) => progresoDe(c) > 0 && progresoDe(c) < 1);

  function abrirCurso(id: string) {
    router.push(`/curso/${id}`);
  }

  function salir() {
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.pantalla} edges={["top"]}>
      {/* FlatList para la lista de cursos; lo de arriba va en el encabezado
          de la lista para que todo haga scroll junto */}
      <FlatList
        data={cursos}
        keyExtractor={(curso) => curso.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.encabezado}>
            <View style={styles.filaSaludo}>
              <View>
                <Text style={styles.saludo}>Hola, {usuarioDemo.nombre} 👋</Text>
                <Text style={styles.subtitulo}>¿Qué vas a aprender hoy?</Text>
              </View>
              <Pressable onPress={salir}>
                <Text style={styles.salir}>Salir</Text>
              </Pressable>
            </View>

            {cursoActual && (
              <Pressable
                style={({ pressed }) => [styles.continuar, pressed && { opacity: 0.8 }]}
                onPress={() => abrirCurso(cursoActual.id)}
              >
                <Text style={styles.continuarEtiqueta}>Continúa donde te quedaste</Text>
                <Text style={styles.continuarTitulo}>{cursoActual.titulo}</Text>
                <BarraProgreso progreso={progresoDe(cursoActual)} />
                <Text style={styles.continuarPorcentaje}>
                  {Math.round(progresoDe(cursoActual) * 100)}% completado
                </Text>
              </Pressable>
            )}

            <Text style={styles.seccion}>Cursos</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TarjetaCurso curso={item} alPresionar={() => abrirCurso(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.claro.fondo,
  },
  lista: {
    padding: 20,
  },
  encabezado: {
    gap: 20,
    marginBottom: 12,
  },
  filaSaludo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  saludo: {
    fontSize: 26,
    fontWeight: "700",
    color: colores.claro.texto,
  },
  subtitulo: {
    fontSize: 15,
    color: colores.claro.textoSuave,
  },
  salir: {
    fontSize: 15,
    fontWeight: "600",
    color: colores.claro.primario,
  },
  continuar: {
    gap: 8,
    padding: 18,
    borderRadius: radio,
    backgroundColor: colores.claro.exitoFondo,
  },
  continuarEtiqueta: {
    fontSize: 13,
    fontWeight: "600",
    color: colores.claro.primarioOscuro,
  },
  continuarTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: colores.claro.texto,
  },
  continuarPorcentaje: {
    fontSize: 13,
    color: colores.claro.textoSuave,
  },
  seccion: {
    fontSize: 18,
    fontWeight: "700",
    color: colores.claro.texto,
  },
  separador: {
    height: 12,
  },
});
