# Diario de decisiones

Las decisiones de Brote, en orden. Las de arquitectura tienen su registro
completo (contexto, alternativas y consecuencias) en
[brote_specs/docs/decisiones](https://github.com/BroteCodigoAbierto/brote_specs/tree/main/docs/decisiones),
que es la fuente de verdad. Aquí va el resumen y las decisiones de producto y de
entrega que no ameritan un registro propio.

Regla: una decisión no se edita para cambiarla. Se escribe una nueva que la
reemplaza.

## 2026-08-30 · Plan de proyecto final

- **Decisión**: Brote, una plataforma de cursos interactivos creados por la
  comunidad. La web sirve para cursar y crear cursos, y el móvil solo para
  cursar. Stack del plan: Spring Boot, Vue 3 y Expo.
- **Después**: el producto se quedó igual, pero el stack cambió el 2026-10-14
  (siguiente entrada).

## 2026-10-14 · Base del proyecto (decisiones 0001 a 0014)

| # | Decisión | Por qué | Qué se descartó |
|---|---|---|---|
| [0001](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0001-sdd-con-spec-kit.md) | SDD con GitHub Spec Kit, con la plantilla de spec del curso | Comandos para especificar, planear, dividir en tareas e implementar, con el formato que pide la materia | La plantilla nativa de Spec Kit; SDD solo con carpetas de markdown |
| [0002](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0002-repos-separados-con-hub.md) | Cuatro repos, con `brote_specs` como hub | Una sola constitución y una sola numeración de features para los tres clientes | Spec Kit en cada repo; monorepo |
| [0003](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0003-alcance-de-cada-cliente.md) | La web cursa y crea; el móvil cursa | El editor no cabe bien en una pantalla táctil | Que los dos hagan todo; la web solo para autores |
| [0004](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0004-typescript-e-identificadores-en-espanol.md) | TypeScript estricto e identificadores en español | Un campo mal escrito en una actividad se detecta al compilar | JavaScript; identificadores en inglés |
| [0005](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0005-contrato-por-copia.md) | Contrato de tipos compartido por copia generada | Simple y sin publicar paquetes | Paquete con Zod; OpenAPI con generación |
| [0006](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0006-postgresql-y-prisma.md) | Express 5 + PostgreSQL + Prisma, con las actividades en JSONB | Relaciones claras y cliente tipado | SQLite; MongoDB; Drizzle o SQL directo. **Reemplaza Spring Boot del plan** |
| [0007](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0007-better-auth.md) | Better Auth dentro del backend | Los usuarios en nuestra base, con soporte para Expo | JWT propio; Clerk, Supabase o Firebase |
| [0008](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0008-web-vite-react-router.md) | Web como SPA con Vite, React y React Router | Misma API que el móvil, sin servidor propio | Next.js. **Reemplaza Vue 3 del plan** |
| [0009](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0009-estilos-css-modules.md) | CSS Modules con tokens en variables CSS | Marcado limpio y control del diseño | Tailwind; MUI o Mantine |
| [0010](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0010-datos-con-fetch-propio.md) | `fetch` propio (`pedir()`, `ErrorHttp`) y hooks | El patrón visto en clase, sin dependencias | TanStack Query |
| [0011](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0011-estado-con-context.md) | Estado global con Context y `useReducer` | Lo que trae React alcanza | Zustand; Redux Toolkit |
| [0012](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0012-validacion-manual.md) | Validación manual con un `quickstart.md` por feature | Cada criterio de aceptación se comprueba a mano | Pruebas automáticas obligatorias; TDD |
| [0013](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0013-flujo-de-ramas.md) | Ramas `feature/FXX-...` → `dev` → `main` con PR | Registro de qué se integró y cuándo | feature → main; merge local sin PR |
| [0014](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/decisiones/0014-publicacion-con-revision.md) | Borrador → en revisión → publicado, aprobado a mano en la base | Un alumno nunca ve una lección a medio editar | Publicar sin revisión; publicar al guardar |

## 2026-11-02 · Sistema de diseño de vidrio (0015)

- **Decisión**: un solo sistema de diseño para web y móvil
  ([`docs/diseno.md`](https://github.com/BroteCodigoAbierto/brote_specs/blob/main/docs/diseno.md)),
  con los mismos nombres de tokens y de componentes.
- **Por qué**: cada feature estaba inventando sus estilos.
- **Descartado**: seguir con estilos sueltos; Tamagui o NativeWind; reusar la
  paleta de otro proyecto.

## 2026-11-03 · Catálogo de actividades del MVP

- **Decisión**: el MVP agrega cinco tipos de actividad (F11 a F15) y cambia el
  orden de las features que faltaban (PR #6 de `brote_specs`).

## 2026-11-07 y 2026-11-08 · Imágenes y audios en PostgreSQL (0016 y 0017)

- **Decisión**: los bytes de imágenes y audios se guardan en PostgreSQL
  (`bytea`) y la API los sirve con los permisos del curso.
- **Por qué**: el despliegue no necesita un disco persistente ni un servicio
  extra.
- **Descartado**: disco del servidor; almacenamiento compatible con S3; una
  sola tabla `archivo` para los dos tipos.
- **De producto** (al analizar F13): el servidor rechaza fotos con metadatos
  (EXIF, XMP, IPTC) y PNG o WebP animados, y el editor los limpia antes de
  subirlos.

## 2026-11-08 · Aciertos debajo del título (arreglo de F04)

- **Decisión**: en el detalle del curso del móvil, "N de M aciertos" va en una
  segunda línea.
- **Por qué**: a 375 px el título se partía a media palabra ("Condicio /
  nales").

## 2026-11-22 · Entrega final

- **`main` = F14 en los cuatro repos.** Se integraron F11 a F14 (PRs a `dev`) y
  `dev` pasó a `main`. En backend y móvil, el `main` anterior traía restos del
  plan de agosto (Spring Boot y un mockup de octubre), así que se reemplazó.
  El mockup quedó en la etiqueta `archivo/mockup-octubre` del repo móvil.
- **La feature de temas no entra a la entrega.** Está en la rama `Codex-Temas`
  (paletas y modo claro/oscuro en Cuenta) y no se ha validado. Meterla el día
  de la entrega era arriesgar lo que sí funciona.
- **En Aplicaciones Móviles se entrega `brote_mobile_expo`.** Las specs y los
  otros repos se ligan desde el README. El mismo diario está en `brote_web_react`
  para la materia de Web: es un solo proyecto.
- **La app se queda en vertical.** `app.json` fija `"orientation": "portrait"`:
  las lecciones están diseñadas para una columna y girar el teléfono no cambia
  nada.

## 2026-11-22 · Despliegue de la web en Vercel

- **Decisión**: la web y la API se despliegan en Vercel (plan gratis) y la base
  en Neon (PostgreSQL gratis, conectado desde el Marketplace de Vercel).
  - Web: https://brote-web-react.vercel.app
  - API: https://brote-api.vercel.app (Express corre como una función,
    `api/index.ts`; en local se sigue arrancando con `src/servidor.ts`).
- **Por qué así**: la sesión vive en una cookie. Si la web y la API están en
  dominios distintos, Chrome la trata como de terceros y no la manda. Por eso la
  web reenvía `/api/*` a la API (`vercel.json`): para el navegador es un solo
  sitio.
- **Descartado**: Render (la API se duerme y tarda ~50 s en despertar) y Azure
  (su plan gratis de Static Web Apps no puede reenviar a otra API).
- **Para poder desplegar gratis**, `brote_web_react` y `brote_specs` pasaron a
  ser públicos, como ya lo eran el backend y el móvil.
- **Límites**: cada petición acepta como máximo 4.5 MB en Vercel, así que no se
  pueden subir imágenes de más de ~4 MB en la versión desplegada. La limpieza de
  imágenes y audios sin usar (que corre cada hora en local) no corre en Vercel.
  Los datos de prueba se siembran con `SEMBRAR=1` en el proyecto de Vercel
  (`scripts/vercel-build.sh` del backend).
