import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PantallaLogin } from './src/screens/PantallaLogin';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PantallaLogin />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
