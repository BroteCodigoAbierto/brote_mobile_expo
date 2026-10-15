import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarraProgreso from "../../componentes/BarraProgreso";
import Boton from "../../componentes/Boton";
import FilaLeccion from "../../componentes/FilaLeccion";
import { colores } from "../../constantes/tema";
import { buscarCurso, progresoDe } from "../../datos/cursos";

// Un curso abierto: información del curso y su lista de lecciones.
// El [id] del nombre del archivo hace que la ruta sea /curso/git-esencial, etc.
export default function DetalleCurso() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const curso = buscarCurso(id);

  // si llega un id que no existe, no hay nada que mostrar
  if (!curso) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.vacio}>
          <Text style={styles.titulo}>Curso no encontrado</Text>
          <Boton titulo="Volver" alPresionar={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const progreso = progresoDe(curso);
  const hechas = curso.lecciones.filter((l) => l.completada).length;
  // la siguiente lección es la primera que no está completada
  const siguiente = curso.lecciones.find((l) => !l.completada);

  return (
    <SafeAreaView style={styles.pantalla} edges={["top"]}>
      <FlatList
        data={curso.lecciones}
        keyExtractor={(leccion) => leccion.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.encabezado}>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.volver}>‹ Cursos</Text>
            </Pressable>

            <View style={[styles.icono, { backgroundColor: curso.color }]}>
              <Text style={styles.textoIcono}>{curso.icono}</Text>
            </View>

            <Text style={styles.titulo}>{curso.titulo}</Text>
            <Text style={styles.autor}>por {curso.autor}</Text>
            <Text style={styles.descripcion}>{curso.descripcion}</Text>

            <View style={styles.progreso}>
              <BarraProgreso progreso={progreso} />
              <Text style={styles.textoProgreso}>
                {hechas} de {curso.lecciones.length} lecciones
              </Text>
            </View>

            {siguiente && (
              <Boton titulo={hechas === 0 ? "Empezar" : "Continuar"} alPresionar={() => {}} />
            )}

            <Text style={styles.seccion}>Lecciones</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <FilaLeccion
            leccion={item}
            numero={index + 1}
            esLaSiguiente={item.id === siguiente?.id}
          />
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
    gap: 10,
    marginBottom: 12,
  },
  volver: {
    fontSize: 16,
    fontWeight: "600",
    color: colores.claro.primario,
    marginBottom: 8,
  },
  icono: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textoIcono: {
    fontSize: 34,
    fontWeight: "700",
    color: colores.claro.texto,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: colores.claro.texto,
  },
  autor: {
    fontSize: 14,
    color: colores.claro.textoSuave,
  },
  descripcion: {
    fontSize: 15,
    lineHeight: 22,
    color: colores.claro.texto,
  },
  progreso: {
    gap: 6,
    marginVertical: 6,
  },
  textoProgreso: {
    fontSize: 13,
    color: colores.claro.textoSuave,
  },
  seccion: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: colores.claro.texto,
  },
  separador: {
    height: 10,
  },
  vacio: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
});
