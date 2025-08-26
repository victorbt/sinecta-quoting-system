# senior-backend-developer-node

Backend técnico de prueba — Cotizador

## ✨ Features

- CRUD completo de cotizaciones (Quotes) y usuarios
- Validación estricta con [Zod](https://zod.dev/) + decorators de `tsoa`
- Generación automática de rutas y especificación OpenAPI mediante `tsoa`
- Inyección de dependencias con `typescript-ioc`
- Documentación y pruebas de endpoints con Swagger UI
- Manejo centralizado de errores (API Errors y errores de validación)
- Middleware de autenticación JWT con `req.user` tipado en TypeScript
- Logging estructurado y middlewares de seguridad (helmet, cors, rate limiting)
- Seeds iniciales para poblar base de datos de prueba
- Tests unitarios e integrados (repositories, services, controllers)
- Arquitectura modular y escalable (Domain → Repositories → Services → Controllers)

---

## 🚀 Getting Started

### 1. Instalar dependencias
```bash
npm install
```

### 2. Levantar base de datos (Postgres vía Docker Compose)
```bash
docker-compose up -d
```

Esto crea un contenedor de Postgres en `localhost:5432`.

### 3. Configurar variables de entorno
Copia `.env.example` a `.env` y ajusta:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sinecta_cotizador?schema=public"
JWT_SECRET="dev-secret"
PORT=4000
```

### 4. Generar cliente Prisma y correr migraciones
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Poblar DB con seeds
```bash
npm run seed
```

### 6. Correr en modo desarrollo
```bash
npm run dev
```

La API estará disponible en:  
➡️ http://localhost:4000  
➡️ Swagger UI: http://localhost:4000/docs

---

## 📂 Folder Structure

- **src/domain** → modelos de dominio, tipos compartidos  
- **src/infrastructure/repositories** → acceso a DB vía Prisma (BaseRepository + repos específicos)  
- **src/services** → lógica de negocio (ej. `QuotesService`)  
- **src/controllers** → controladores TSOA que exponen endpoints  
- **src/middlewares** → middlewares custom (ej. Auth, ErrorHandler)  
- **src/ioc** → configuración de `typescript-ioc` para DI  
- **prisma/** → schema de Prisma, migraciones y seeds  

---

## 🛠️ Technologies Used

- **Backend**
  - [Node.js](https://nodejs.org/)
  - [TypeScript](http://www.typescriptlang.org/)
  - [Express](https://expressjs.com/)
  - [tsoa](https://github.com/lukeautry/tsoa) → rutas + OpenAPI
  - [typescript-ioc](https://github.com/thiagobustamante/typescript-ioc) → inyección de dependencias
  - [Prisma](https://www.prisma.io/) → ORM / migraciones
  - [PostgreSQL](https://www.postgresql.org/)
  - [Zod](https://zod.dev/) → validación de esquemas
  - [docker](https://www.docker.com/) y [docker-compose](https://docs.docker.com/compose) para infraestructura

- **Testing**
  - [Mocha](https://mochajs.org/)
  - [Chai](https://www.chaijs.com/)
  - [Sinon](https://sinonjs.org/) para stubs/mocks
  - [chai-http](https://www.chaijs.com/plugins/chai-http/) para pruebas de endpoints

---

## 🧪 Running Tests

```bash
npm run test
```

Incluye pruebas unitarias y de integración sobre **repositories**, **services** y **controllers**.

---

## ✅ System Requirements

- Node.js 18+  
- npm 9+  
- Docker y Docker Compose instalados  

---

⚡ Con este setup tienes un backend **listo para producción** en arquitectura limpia, con Prisma y TSOA bien integrados, DI sencillo y validación robusta.
