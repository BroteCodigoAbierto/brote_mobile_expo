# Bitácora de IA

Cómo usé la IA para construir la app móvil de Brote: qué le pedí, qué revisé y
dónde se equivocó. Las decisiones que salieron de esto están en
[diario-decisiones.md](diario-decisiones.md).

## Herramientas

| Herramienta | Para qué |
|---|---|
| **Claude Code** (Claude Opus 5.5) | Specs, planes, tareas e implementación con los comandos `/speckit-*`, en una sesión abierta en `brote_specs` con acceso a los otros tres repos |
| **GitHub Spec Kit** | El flujo de SDD: spec → plan → tareas → análisis → implementación |
| **Claude Desktop con computer use** | Validar la app en mi iPhone 12 mini por iPhone Mirroring, desde la Mac |
| **Claude en Chrome** | Validar la web, que comparte API y contrato con el móvil |
| **Codex** | La feature de temas (rama `Codex-Temas`), que no entró a la entrega |

## Cómo trabajo con la IA

1. **Las reglas van primero.** La IA lee `CLAUDE.md` y la
   [constitución](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/.specify/memory/constitution.md)
   antes de cada tarea: todo en español, la spec dice qué y no cómo,
   identificadores sin acentos, un commit por tarea.
2. **Spec antes de código.** `/speckit-specify` escribe la spec con el formato
   del curso y yo la reviso antes del plan. Cada criterio de la spec dice si es
   `[web]`, `[móvil]` o de los dos.
3. **Las decisiones son mías.** La IA me pregunta las decisiones de producto y
   de diseño una por una, con su recomendación primero, y yo elijo.
4. **Un commit por tarea** (`F03: ...`), para revisar cada cambio por separado.
5. **Terminado = validado a mano en el teléfono.** Cada criterio `[móvil]` se
   comprueba en el iPhone siguiendo el `quickstart.md` de la feature.
6. **Una sesión por cosa.** Una hace la feature y otra la valida.
   `continuar.md` en `brote_specs` guarda el estado entre sesiones.

## Cronología

| Fecha | Qué se hizo |
|---|---|
| 2026-08-30 | Plan de proyecto con otro stack para la API y la web (Spring Boot y Vue); el móvil ya era Expo |
| 2026-10-05 | Primer mockup de la app (pantalla de entrar) |
| 2026-10-14 | Con Claude Code: base del proyecto, Spec Kit, constitución y decisiones 0001 a 0014. El móvil solo cursa (0003) |
| 2026-10-26 | F01: crear cuenta y entrar; sesión en almacenamiento seguro |
| 2026-11-02 | F02 catálogo y F03 cursar una lección |
| 2026-11-03 | F04 progreso |
| 2026-11-06 a 11-08 | F11 actividades de relacionar; F12 código y terminal |
| 2026-11-08 | F13 imágenes (`expo-image`); F14 escuchar y repetir (`expo-speech`, `expo-audio`) |
| 2026-11-22 | Entrega: F14 en `main`, esta bitácora y el diario de decisiones |

## Dónde se equivocó la IA y cómo me di cuenta

Todos estos casos están en los commits y en `continuar.md` de `brote_specs`.

- **Código que el teléfono no ejecuta (F03).** La IA usó `Object.hasOwn`, que
  el motor de JavaScript de React Native (Hermes) no soporta, y supuso que
  Hermes separa los acentos al normalizar texto. Se cambió por una alternativa
  compatible y un respaldo (commits `2978137` y `38b9f86`).
- **Una etiqueta tapada (F12).** En la "Solución de referencia", la etiqueta
  del lenguaje salía cortada porque la tapaba el código. Lo vi en el iPhone.
- **El icono que partía el texto (F11).** Con número, el icono de correcto o
  incorrecto partía el texto del elemento; ahora va de insignia.
- **Un título partido a media palabra (F04).** A 375 px, "Condicionales" se
  partía en "Condicio / nales". Elegí poner "N de M aciertos" en una segunda
  línea.
- **Un criterio imposible de probar (F12, V51).** La spec pedía algo que
  contradecía una regla de F03 (salir de la lección pide confirmación). Al
  validar vimos que no se podía y se movió la prueba a otras lecciones.
- **Un plan que se saltaba la constitución (F11).** `/speckit-analyze` encontró
  que el plan tocaba piezas compartidas sin declararlo como excepción. Se
  corrigió antes de implementar.

## Lo que le rechacé o le cambié a la IA

- **Pruebas automáticas.** Las descarté para el MVP (decisión 0012): valido a
  mano en el teléfono con un quickstart por feature.
- **Librerías que resolvían todo.** Al decidir el stack se compararon TanStack
  Query, Zustand, Redux y librerías de componentes (Tamagui, NativeWind). Me
  quedé con lo que trae React, el patrón de `fetch` del Taller 10 y un sistema
  de diseño propio (decisiones 0010, 0011 y 0015).
- **El editor en el teléfono.** El móvil solo cursa; crear cursos se queda en
  la web, porque el editor en una pantalla táctil necesitaría otro diseño
  (decisión 0003).
- **La feature de temas** que hizo Codex: no la integré el día de la entrega
  porque no estaba validada.
- _Por completar con mis propios casos:_
  - _Una propuesta de la IA que rechacé y por qué._
  - _Una vez que me dio código que parecía bien y no funcionó en el teléfono._

## Límites que encontré

- Desde Linux no se puede probar el iPhone (iPhone Mirroring es de macOS): la
  validación móvil se hace en la Mac.
- Faltan criterios del móvil: F13 va en 51 de 90 (los que faltan son del
  iPhone) y F14 en 0 de 82.
- Cursar sin conexión es F10 y todavía no está: sin red, la app avisa que no hay
  conexión, pero no guarda cursos para después.
