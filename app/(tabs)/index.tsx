import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function QuestionScreen() {
  return (
      <View style={styles.container}>
        <Text style={styles.label}>Pregunta 3 de 8</Text>

        <Text style={styles.question}>Cual es la capital de Francia?</Text>

        <TextInput style={styles.input} placeholder="Escribe aqui tu respuesta"/>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Continuar</Text>
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});