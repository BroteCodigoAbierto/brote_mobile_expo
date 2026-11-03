@AGENTS.md

# brote_mobile_expo: instrucciones para el agente

App móvil de Brote: **cursar** (incluso sin conexión). No tiene editor de
cursos. **Las specs, la constitución y las decisiones viven en
`../brote_specs`**; este repo solo implementa lo que ahí está especificado.

Antes de cambiar algo, lee:

1. `../brote_specs/.specify/memory/constitution.md`
2. `../brote_specs/docs/estilo-codigo.md`
3. `../brote_specs/docs/diseno.md` si tocas pantallas: tokens, componentes y
   patrones del sistema de diseño de vidrio. Es obligatorio seguirlo.
4. La spec y el plan de la feature: `../brote_specs/specs/features/F0X-.../`

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript · expo-router (rutas en `src/app/`).
Las reglas de Expo de `AGENTS.md` aplican: instala paquetes con
`npx expo install` y consulta la documentación de la versión del SDK.

## Estructura

```text
src/
  app/                rutas de expo-router (cada archivo es una pantalla)
  componentes/        componentes reutilizables
  actividades/        un componente por tipo de actividad, el registro tipo → componente
                      (registro.ts) y el reproductor de lecciones (F03)
  constantes/tema.ts  tokens del sistema de diseño (mismos nombres y valores que la web)
  hooks/              useColores (y useSombras), usePeticion y hooks por recurso
  servicios/          api.ts (pedir, ErrorHttp) y funciones por recurso
  contextos/          estado global: un contexto por área, con useReducer
  utilidades/         funciones de presentación sin estado (p. ej. la portada de un curso)
  config.ts           URL de la API (EXPO_PUBLIC_URL_API)
  tipos/contrato.ts   GENERADO desde brote_specs; no se edita a mano
```

## Reglas

- En `src/app/` solo van pantallas y layouts; todo lo demás fuera.
- Estilos con `StyleSheet.create` al final del archivo; colores de
  `useColores()`, sombras de `useSombras()`, espacios, radios y tipografía de
  `constantes/tema.ts`. Nada de colores, tamaños ni fuentes sueltos.
- Todo texto va con `Texto` (Plus Jakarta Sans con las variantes del sistema);
  cada pantalla va dentro de `FondoAmbiental`, y las tarjetas y paneles son
  `Superficie` (Liquid Glass en iOS, opaco en Android).
- Componentes del sistema de diseño: `Texto`, `FondoAmbiental`, `Superficie`,
  `Boton`, `CampoTexto`, `CampoContrasena`, `Buscador`, `Aviso`, `Insignia`,
  `EstadoVacio`, `ErrorCarga`, `IndicadorCarga`, `Marca`, `PortadaCurso`,
  `TarjetaCurso` y, para las lecciones (F03), `BarraProgreso`,
  `BarraRespuesta`, `OpcionRespuesta`, `BloqueCodigo`, `TarjetaVolteable`,
  `CampoEspacio` y `ResultadoLeccion` (la confirmación es `Alert.alert`).
  Iconos de `lucide-react-native`.
- Agregar un tipo de actividad: su componente en `actividades/` y una línea
  en `actividades/registro.ts` (el tipo del registro obliga a tenerlo).
- Un componente o token nuevo se agrega primero a `docs/diseno.md` y también
  en la web, con el mismo nombre.
- Los componentes no llaman `fetch`: usan `servicios/` y `usePeticion`.
- Sin TanStack Query, SWR, Redux ni Zustand (decisiones 0010 y 0011 de
  brote_specs). Una dependencia nueva va justificada en el plan.
- Toda pantalla que carga datos muestra cargando, vacío, error y sin conexión.
- Ramas `feature/F0X-...` desde `dev`; commits `F0X: ...`. Sin push sin
  permiso.
- Antes de terminar: `npm run tipos` y `npm run lint`.
