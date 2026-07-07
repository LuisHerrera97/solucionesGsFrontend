# Financiera Soluciones — Frontend

Aplicación web (PWA) para gestión de créditos, cobranza, clientes y administración del sistema.

## Stack

- **React 19** + **TypeScript**
- **Vite 7** (build y dev server)
- **React Router 7** (rutas)
- **TanStack Query 5** (estado del servidor)
- **Axios** (HTTP)
- **Tailwind CSS 4** (estilos)
- **Recharts** (gráficas del dashboard)
- **vite-plugin-pwa** (instalable como app)

## Requisitos

- Node.js 20+
- npm

## Configuración

```bash
npm install
```

Crear `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:55501/
```

Ajusta la URL al backend que uses en desarrollo o producción.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run typecheck` | Verificación de tipos |
| `npm run lint` | ESLint |
| `npm run preview` | Vista previa del build |

## Estructura del proyecto

```
src/
├── core/                 # Infraestructura HTTP y endpoints
│   ├── config/apiEndpoints.ts
│   └── http/
├── shared/               # Componentes, hooks y utilidades reutilizables
│   ├── components/
│   ├── cobranza/
│   ├── creditos/
│   ├── constants/
│   ├── date/
│   ├── hooks/
│   ├── ticket/
│   └── utils/
├── features/             # Dominios de negocio
│   ├── auth/
│   ├── cobranza/
│   ├── creditos/
│   ├── general/
│   ├── home/
│   └── seguridad/
├── layout/               # Layout, Sidebar, Navbar
└── routes/               # AppRouter, ProtectedRoute
```

Cada dominio se organiza en **sub-features** con esta estructura:

```
features/{dominio}/{subFeature}/
  pages/        → UI de la pantalla (presentación)
  hooks/        → use{Nombre}Page + *Hooks (React Query)
  components/   → UI específica del sub-feature
```

Las llamadas HTTP viven en `features/{dominio}/api.ts`. No se usan clases `*Service`.

## Arquitectura y convenciones

Las reglas para el asistente de Cursor están en `.cursor/rules/`:

| Archivo | Tema |
|---------|------|
| `proyecto-general.mdc` | Stack, comandos, principios |
| `arquitectura-features.mdc` | Dominios, sub-features, capas |
| `react-paginas-hooks.mdc` | Páginas delgadas y hooks |
| `api-y-datos.mdc` | API, React Query, errores |
| `ui-estilos.mdc` | Tailwind y componentes compartidos |

### Patrón de pantalla

1. **`pages/X.tsx`** — solo JSX y composición.
2. **`hooks/useXPage.ts`** — estado, permisos, handlers.
3. **`hooks/xHooks.ts`** — `useQuery` / `useMutation`.
4. Estados loading/error/vacío con `StatusPanel`.
5. Permisos con `useAuth().canBoton('CLAVE_BOTON')`.

## Rutas principales

| Ruta | Pantalla |
|------|----------|
| `/` | Dashboard (home) |
| `/login` | Inicio de sesión |
| `/clientes` | Clientes |
| `/creditos` | Listado de créditos |
| `/creditos/nuevo` | Nuevo crédito |
| `/creditos/:id` | Detalle del crédito |
| `/creditos/:id/estado-cuenta` | Estado de cuenta |
| `/creditos/:id/reestructura` | Reestructura |
| `/creditos/:id/condonacion` | Condonación |
| `/movimientos` | Movimientos de caja |
| `/cobranza` | Cobranza del día |
| `/pendientes` | Pendientes de cobro |
| `/general/configuracion` | Configuración del sistema |
| `/general/zonas` | Zonas de cobranza |
| `/general/auditoria` | Auditoría |
| `/general/feriados` | Feriados |
| `/seguridad/usuarios` | Usuarios |
| `/seguridad/perfiles` | Perfiles |
| `/seguridad/permisos` | Permisos |
| `/seguridad/elementos` | Módulos, páginas y botones |

Rutas legacy (`/config`, `/sistema/*`) redirigen a las rutas actuales.

## PWA

En producción la app se registra como PWA (`vite-plugin-pwa`). Los assets estáticos se cachean; las llamadas a la API usan estrategia `NetworkOnly`.
