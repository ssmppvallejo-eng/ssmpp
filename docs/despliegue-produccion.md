# Despliegue a producción (Vercel + PostgreSQL)

Esta guía corresponde a la aplicación S SMPP: Next.js 16, NextAuth 4, Prisma 6,
Google OAuth y evidencias almacenadas dentro de PostgreSQL.

## 1. Validación local

Instala dependencias y ejecuta todas las comprobaciones:

```bash
pnpm install
pnpm check
```

`postinstall` genera Prisma Client. `pnpm check` ejecuta ESLint, TypeScript y el
build de producción.

## 2. Variables de entorno

Copia `.env.example` como `.env` únicamente para desarrollo. Nunca confirmes
`.env` en Git. En Vercel configura por separado Development, Preview y
Production:

- `DATABASE_URL`: conexión PostgreSQL con pooling y TLS.
- `GOOGLE_CLIENT_ID`: identificador OAuth de Google.
- `GOOGLE_CLIENT_SECRET`: secreto OAuth de Google.
- `NEXTAUTH_URL`: URL pública exacta, por ejemplo `https://ssmpp.example.edu`.
- `NEXTAUTH_SECRET`: secreto aleatorio generado con `openssl rand -base64 32`.

Después de cambiar variables en Vercel se necesita un nuevo despliegue.

## 3. Base de datos

Usa bases distintas para Preview y Production. Aplica únicamente migraciones
ya versionadas:

```bash
pnpm db:migrate:status
pnpm db:migrate:deploy
```

No ejecutes `prisma migrate dev` ni `prisma db push` contra producción.

El seed es destructivo: elimina asignaciones y reemplaza el catálogo completo.
Solo para una base nueva, y después de verificar `DATABASE_URL`, ejecútalo con
la confirmación literal:

```bash
CONFIRM_DESTRUCTIVE_SEED=REEMPLAZAR_CATALOGO_Y_ASIGNACIONES pnpm db:seed
```

Configura copias de seguridad y alertas de almacenamiento. Cada evidencia de
hasta 5 MB se guarda como binario en PostgreSQL.

## 4. Google OAuth

En Google Cloud crea credenciales OAuth 2.0 para una aplicación web. Registra:

```text
Origen:       https://TU_DOMINIO
Redirección:  https://TU_DOMINIO/api/auth/callback/google
```

Registra por separado cualquier dominio de Preview que se vaya a usar para
probar el inicio de sesión.

## 5. Primer administrador

La cuenta debe iniciar sesión con Google una vez. Se crea como `ESTUDIANTE` y
`PENDIENTE`. Después, desde una terminal que use la base correcta:

```bash
pnpm db:admin administrador@example.edu --confirm
```

El script no crea usuarios ni modifica nada sin `--confirm`. La cuenta debe
cerrar sesión y volver a entrar para renovar su token.

## 6. Vercel

1. Importa el repositorio y selecciona el preset Next.js.
2. Conserva `pnpm` como gestor mediante el lockfile existente.
3. Añade las cinco variables en Production y otras credenciales/base en Preview.
4. Despliega primero a Preview y prueba autenticación, roles, asignaciones,
   evaluaciones, reportes y evidencias.
5. Aplica las migraciones a producción antes de promover el despliegue.
6. Configura el dominio, actualiza `NEXTAUTH_URL` y el callback de Google, y
   vuelve a desplegar.

El script `vercel-build` genera Prisma Client y después ejecuta `next build`.
Las migraciones no se ejecutan dentro del build para impedir que un Preview
modifique accidentalmente la base de producción.

## 7. Comprobación posterior

- Iniciar y cerrar sesión en una ventana privada.
- Confirmar que una cuenta pendiente no entra en `/app`.
- Confirmar que un usuario común recibe `403` en rutas administrativas.
- Subir, descargar y reemplazar una evidencia válida.
- Rechazar archivos de más de 5 MB o con contenido que no corresponda al MIME.
- Revisar logs de Vercel y conexiones/espacio de PostgreSQL.
- Probar una restauración del respaldo antes de incorporar usuarios reales.

## Auditoría de acceso

Las rutas de negocio usan `requireApprovedSession`: exigen sesión y estado
`APROBADO`; las rutas administrativas restringen además el rol
`ADMINISTRADOR`. Las evidencias requieren pertenecer a la asignación, salvo
administradores y coordinadores. Los evaluadores solo acceden a evaluaciones
en las que son miembros. Mantén estas verificaciones en el servidor aunque la
interfaz también oculte acciones.
