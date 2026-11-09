import * as Speech from "expo-speech";
import { ETIQUETA_VOZ, type IdiomaCurso } from "../tipos/contrato";

// La voz sintetizada del teléfono (spec F14; brote_specs, research de F14, punto 10).
// https://docs.expo.dev/versions/v58.0.0/sdk/speech/

// En Android la lista puede venir vacía mientras arranca el motor de voz.
const ESPERA_VOCES_MS = 500;

// "es_MX" y "es-mx" son "es-MX".
function etiquetaDe(voz: Speech.Voice): string {
  return voz.language.replace(/_/g, "-").toLowerCase();
}

// Solo en desarrollo: EXPO_PUBLIC_SIN_VOCES=ko (o "ko,ja") esconde las voces de esos idiomas,
// para validar "sin voz en el idioma" en un teléfono que sí las tiene (research de F14, punto
// 17). En una compilación de producción no existe.
function escondidasEnDesarrollo(): string[] {
  if (!__DEV__) return [];
  return (process.env.EXPO_PUBLIC_SIN_VOCES ?? "").split(",").map((idioma) => idioma.trim());
}

function esperar(milisegundos: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

// Las voces del teléfono que hablan ese idioma, en cualquier variante.
export async function vocesDelIdioma(idioma: IdiomaCurso): Promise<Speech.Voice[]> {
  if (escondidasEnDesarrollo().includes(idioma)) return [];
  let voces = await Speech.getAvailableVoicesAsync().catch(() => []);
  if (voces.length === 0) {
    await esperar(ESPERA_VOCES_MS);
    voces = await Speech.getAvailableVoicesAsync().catch(() => []);
  }
  return voces.filter((voz) => {
    const etiqueta = etiquetaDe(voz);
    return etiqueta === idioma || etiqueta.startsWith(`${idioma}-`);
  });
}

// La de la variante que se prefiere (ETIQUETA_VOZ) y, entre iguales, la de más calidad
// (Enhanced). Si no, cualquiera del idioma, también con la de más calidad primero.
export function elegirVoz(voces: Speech.Voice[], idioma: IdiomaCurso): Speech.Voice | null {
  const preferida = ETIQUETA_VOZ[idioma].toLowerCase();
  const mejorPrimero = [...voces].sort(
    (a, b) =>
      Number(b.quality === Speech.VoiceQuality.Enhanced) -
      Number(a.quality === Speech.VoiceQuality.Enhanced),
  );
  return mejorPrimero.find((voz) => etiquetaDe(voz) === preferida) ?? mejorPrimero[0] ?? null;
}
