# brote_mobile_expo

App móvil de **Brote**, la plataforma open source de cursos interactivos
creados por la comunidad. Aquí se cursan lecciones, también sin conexión. Los
cursos se crean en la web
([brote_web_react](https://github.com/BroteCodigoAbierto/brote_web_react)).

Qué hace y por qué está en
[brote_specs](https://github.com/BroteCodigoAbierto/brote_specs). Consume la API
de [brote_backend_express](https://github.com/BroteCodigoAbierto/brote_backend_express).

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
