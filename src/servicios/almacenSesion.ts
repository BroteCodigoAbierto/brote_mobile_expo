import * as SecureStore from "expo-secure-store";
import { CLAVES } from "../constantes/almacenamiento";
import type { Usuario } from "../tipos/contrato";

// La sesión guardada en el dispositivo, cifrada (Keychain en iOS, Keystore en
// Android). https://docs.expo.dev/versions/v58.0.0/sdk/securestore/
//
// Si el almacén falla al leer, se comporta como si no hubiera nada: lo peor
// que pasa es que hay que volver a entrar.

export async function leerToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CLAVES.token).catch(() => null);
}

export function guardarToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(CLAVES.token, token);
}

export async function leerUsuario(): Promise<Usuario | null> {
  const texto = await SecureStore.getItemAsync(CLAVES.usuario).catch(() => null);
  if (!texto) return null;
  try {
    return JSON.parse(texto) as Usuario;
  } catch {
    return null;
  }
}

export function guardarUsuario(usuario: Usuario): Promise<void> {
  return SecureStore.setItemAsync(CLAVES.usuario, JSON.stringify(usuario));
}

export async function borrarSesionGuardada(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(CLAVES.token),
    SecureStore.deleteItemAsync(CLAVES.usuario),
  ]);
}
