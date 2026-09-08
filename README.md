# 🐾 VetHD - Frontend Suite

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![InsForge](https://img.shields.io/badge/InsForge-BaaS-0D9488?style=for-the-badge&logo=postgresql&logoColor=white)
![GitFlow](https://img.shields.io/badge/GitFlow-Enforced-F05032?style=for-the-badge&logo=git&logoColor=white)

> **Proyecto Universitario**: Plataforma Clínica Veterinaria de Alta Definición  
> **Curso**: Herramientas de Desarrollo (**HD**)  
> **Autor**: Edudev2004 / Rommel Navarro  

---

## 📖 Descripción General

**VetHD (Herramientas de Desarrollo Veterinary Suite)** es una aplicación web SaaS moderna orientada a la gestión integral de clínicas veterinarias. Ofrece control de acceso basado en roles (RBAC), autenticación segura con InsForge BaaS, administración de personal médico, matriz de permisos dinámica y gestión asistida de pacientes.

---

## ✨ Características Principales (Épica 1)

- 🔒 **Autenticación y Seguridad**: Inicie sesión seguro con InsForge Auth JWT, bloqueo automático tras 5 intentos fallidos y persistencia de sesión local.
- 👤 **Perfiles Dinámicos de Usuarios**: Mapeo en tiempo real de roles, fotos de perfil, estado activo/inactivo (Soft Delete) y correo institucional.
- 🛡️ **Matriz de Permisos por Módulo (RBAC)**: Configuración granular de acciones (`Crear`, `Leer/Ver`, `Editar`, `Eliminar`) por rol de usuario con bloqueo inmediato en la navegación.
- 🎨 **Diseño Moderno SaaS**: Interfaz en modo oscuro/claro profesional con componentes reutilizables (Botones, Modales, Tablas, Insignias, Alertas).
- 📊 **Conteos Dinámicos Sincronizados**: Métricas reactivas conectadas directamente a la base de datos PostgreSQL de InsForge.

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **Framework UI** | React | `18.3.1` |
| **Lenguaje** | TypeScript | `5.5.3` |
| **Bundler / Dev Server** | Vite | `6.4.3` |
| **Estilos** | Vanilla CSS + Tailwind CSS | `3.4.1` (Locked) |
| **Iconografía** | Google Material Symbols | Outlined / Rounded |
| **BaaS / Backend Client** | `@insforge/sdk` | Integración PostgreSQL & Auth |

---

## 📁 Estructura del Proyecto (Feature-Based Architecture)

```text
src/
├── components/          # Componentes UI atómicos y reutilizables
│   └── ui/              # Button, Input, Modal, Badge, ToggleSwitch, AlertPill, AccessDeniedView
├── config/              # Configuración de clientes (InsForge SDK)
├── features/            # Módulos organizados por características
│   ├── auth/            # Contexto de Autenticación, Login, Permisos
│   ├── roles/           # Gestión de Roles, Matriz de Permisos, Modales
│   └── users/           # Gestión de Usuarios del Sistema, Tabla, Modales
├── layouts/             # DashboardLayout con Sidebar dinámico y cabecera
├── types/               # Tipos e interfaces globales
└── App.tsx              # Componente principal con Proveedores de Estado
```

---

## ⚙️ Requisitos Previos e Instalación

### Requisitos
- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior

### Pasos de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Edudev2004/hd-veterinaria-frontend.git
   cd hd-veterinaria-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env.local`)**:
   Cree un archivo `.env.local` en la raíz con la URL de InsForge:
   ```env
   VITE_INSFORGE_URL=https://c2g6m52b.us-east.insforge.app
   VITE_INSFORGE_ANON_KEY=your-anon-key
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 🔑 Cuentas de Demostración (Épica 1)

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@veterinariahd.com` | `ClaveSegura2026` | Acceso total protegido |
| **Veterinario** | `vet.montes@veterinariahd.com` | `ClaveSegura2026` | Historial médico y consultas |
| **Recepcionista** | `carlos.recepcion@veterinariahd.com` | `ClaveSegura2026` | Citas, clientes y facturación |

---

## 🌿 Flujo de Trabajo (GitFlow)

El desarrollo sigue el estándar estricto de **GitFlow**:
- `main`: Rama de producción lista para lanzamientos oficiales.
- `develop`: Rama de integración continua con características estables probadas.
- `feature/HU-xx-*`: Ramas de desarrollo por Historia de Usuario.

---

## 📄 Licencia

Desarrollado para el curso de **Herramientas de Desarrollo (HD)** &copy; 2026.