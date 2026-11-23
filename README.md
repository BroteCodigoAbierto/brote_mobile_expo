# brote_mobile_expo

App móvil de **Brote**, la plataforma open source de cursos interactivos
creados por la comunidad. Aquí se cursan lecciones (cursar sin conexión es F10,
todavía pendiente). Los cursos se crean en la web
([brote_web_react](https://github.com/BroteCodigoAbierto/brote_web_react)).

Qué hace y por qué está en
[brote_specs](https://github.com/BroteCodigoAbierto/brote_specs). Consume la API
de [brote_backend_express](https://github.com/BroteCodigoAbierto/brote_backend_express).

## Entrega de Aplicaciones Móviles

- **Abrir la app en Expo Go** (SDK 58), con la API desplegada en Vercel:
  [página del update con QR](https://expo.dev/accounts/pedroxionx/projects/brote/updates/9c552ca4-8a28-4b29-82f9-5c244751a106)
  (botón *Preview*) o la liga directa
  `exp://u.expo.dev/2f5d7085-adff-4444-8977-a1faf697569a/group/9c552ca4-8a28-4b29-82f9-5c244751a106`.
  Entra con `autor@brote.test` / `brote12345`.
- [Bitácora de IA](docs/bitacora-ia.md)
- [Diario de decisiones](docs/diario-decisiones.md)
- Los otros repos del proyecto:
  [brote_specs](https://github.com/BroteCodigoAbierto/brote_specs) (specs y
  decisiones),
  [brote_backend_express](https://github.com/BroteCodigoAbierto/brote_backend_express)
  (API) y [brote_web_react](https://github.com/BroteCodigoAbierto/brote_web_react)
  (web, donde se crean los cursos).

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript · expo-router

## Arrancar en local

Con la API corriendo (ver brote_backend_express):

```bash
npm install
cp .env.example .env        # en un teléfono físico, pon la IP de tu computadora
npx expo start              # abre en Expo Go o en un emulador
```

## Scripts

| Script                            | Qué hace                                    |
| --------------------------------- | ------------------------------------------- |
| `npm start`                       | Servidor de desarrollo de Expo              |
| `npm run android` / `ios` / `web` | Abre en esa plataforma                      |
| `npm run tipos`                   | Revisa los tipos con TypeScript             |
| `npm run lint`                    | ESLint (configuración de Expo)              |
| `npm run formato`                 | Formatea con Prettier                       |
| `npm run doctor`                  | Revisa dependencias y configuración de Expo |

## Contribuir

Ninguna feature se programa sin spec. El flujo está en
[brote_specs/docs/flujo-trabajo.md](https://github.com/BroteCodigoAbierto/brote_specs/blob/dev/docs/flujo-trabajo.md).
