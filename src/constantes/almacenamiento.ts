// Claves del almacenamiento seguro del dispositivo, todas aquí para no repetir
// textos sueltos. expo-secure-store solo acepta letras, números, ".", "-" y "_".
export const CLAVES = {
  // token Bearer de la sesión (brote_specs, research de F01, punto 2)
  token: "sesion.token",
  // el Usuario en JSON, para entrar sin conexión con el nombre a la vista
  usuario: "sesion.usuario",
} as const;
