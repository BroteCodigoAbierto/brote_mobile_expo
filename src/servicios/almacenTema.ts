import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { CLAVES } from "../constantes/almacenamiento";
import { interpretarTema, temaInicial, type PreferenciaTema } from "../constantes/temas";

export async function leerTema(): Promise<PreferenciaTema> {
  try {
    const texto =
      Platform.OS === "web"
        ? localStorage.getItem(CLAVES.tema)
        : await SecureStore.getItemAsync(CLAVES.tema);
    return interpretarTema(texto);
  } catch {
    return temaInicial;
  }
}

export async function guardarTema(preferencia: PreferenciaTema): Promise<void> {
  const texto = JSON.stringify(preferencia);
  if (Platform.OS === "web") localStorage.setItem(CLAVES.tema, texto);
  else await SecureStore.setItemAsync(CLAVES.tema, texto);
}
