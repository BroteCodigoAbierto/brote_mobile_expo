import { LIMITES_CUENTA, MENSAJES_CUENTA, PATRON_CORREO } from "../tipos/contrato";

// Mismas reglas que valida el backend (spec F01, "Validaciones"). Aquí solo dan
// buena experiencia: el servidor vuelve a revisar todo.

export type CampoCuenta = "nombre" | "correo" | "contrasena";
export type ErroresCuenta = Partial<Record<CampoCuenta, string>>;

// En caracteres Unicode, igual que el backend: "é" cuenta 1.
function largo(texto: string): number {
  return Array.from(texto).length;
}

function errorCorreo(correoEscrito: string): string | undefined {
  const correo = correoEscrito.trim().toLowerCase();
  if (correo === "") return MENSAJES_CUENTA.correoVacio;
  if (largo(correo) > LIMITES_CUENTA.correoMax || !PATRON_CORREO.test(correo)) {
    return MENSAJES_CUENTA.correoInvalido;
  }
  return undefined;
}

// Devuelve un mensaje por campo con error; un objeto vacío es válido.
export function validarCrearCuenta(valores: Record<CampoCuenta, string>): ErroresCuenta {
  const errores: ErroresCuenta = {};
  const nombre = valores.nombre.trim();

  if (nombre === "") errores.nombre = MENSAJES_CUENTA.nombreVacio;
  else if (largo(nombre) > LIMITES_CUENTA.nombreMax) errores.nombre = MENSAJES_CUENTA.nombreLargo;

  errores.correo = errorCorreo(valores.correo);

  const contrasena = valores.contrasena; // tal como se escribió
  if (contrasena === "") errores.contrasena = MENSAJES_CUENTA.contrasenaVacia;
  else if (largo(contrasena) < LIMITES_CUENTA.contrasenaMin) {
    errores.contrasena = MENSAJES_CUENTA.contrasenaCorta;
  } else if (largo(contrasena) > LIMITES_CUENTA.contrasenaMax) {
    errores.contrasena = MENSAJES_CUENTA.contrasenaLarga;
  }

  return sinVacios(errores);
}

// Al entrar no se revisa la longitud de la contraseña: si no cumple, no coincide.
export function validarEntrar(valores: Record<"correo" | "contrasena", string>): ErroresCuenta {
  const errores: ErroresCuenta = { correo: errorCorreo(valores.correo) };
  if (valores.contrasena === "") errores.contrasena = MENSAJES_CUENTA.contrasenaVaciaEntrar;
  return sinVacios(errores);
}

function sinVacios(errores: ErroresCuenta): ErroresCuenta {
  const limpio: ErroresCuenta = {};
  for (const [campo, mensaje] of Object.entries(errores)) {
    if (mensaje) limpio[campo as CampoCuenta] = mensaje;
  }
  return limpio;
}
