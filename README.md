# 🐾 VetHD - Frontend Suite

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat-square&logo=vercel&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-HGV_Project-0052CC?style=flat-square&logo=jira&logoColor=white)

> [!NOTE]
> **Proyecto Universitario**: Plataforma Clínica Veterinaria de Alta Definición  
> **Curso**: Herramientas de Desarrollo (HD) — Grupo 5  
> **Proyecto Jira**: [HD-Grupo5-Veterinaria (Key: `HGV`)](https://edunavdo.atlassian.net/jira/software/projects/HGV/boards/34/backlog)

---

## 👥 1. Integrantes del Equipo

|  #  | Apellidos y Nombres                   | Usuario de GitHub                                    | Rol           |
| :-: | :------------------------------------ | :--------------------------------------------------- | :------------ |
|  1  | **Navarro Domínguez, Rommel Eduardo** | [@Edudev2004](https://github.com/Edudev2004)         | Desarrollador |
|  2  | **Alaya Vargas, Luis Fernando**       | [@LAVIS7](https://github.com/LAVIS7)                 | Desarrollador |
|  3  | **Alvarado Chávez, Romina Liz**       | [@RominaAlvarado](https://github.com/RominaAlvarado) | Desarrollador |
|  4  | **Chugnas Lupuchi, Diego Augusto**    | [@August-CH57](https://github.com/August-CH57)       | Desarrollador |
|  5  | **Cuipal Jara, José Martín**          | [@Josema13Cj](https://github.com/Josema13Cj)         | Desarrollador |
|  6  | **Dextre Cabrera, Enrique Eduardo**   | [@Enrique_Dc](https://github.com/Enrique_Dc)         | Desarrollador |
|  7  | **Medina Niño, Fabrizio Adrián**      | [@FabrizioMn](https://github.com/FabrizioMn)         | Desarrollador |
|  8  | **Olivares Quispetera, José Carlos**  | [@JoseOlivares19](https://github.com/JoseOlivares19) | Desarrollador |

---

## 📖 2. Descripción General

**VetHD (Herramientas de Desarrollo Veterinary Suite)** es una solución web SaaS diseñada para la administración integral de clínicas veterinarias. Ofrece módulos especializados para Propietarios, Veterinarios y Administradores, conectando la experiencia visual interactiva con servicios backend robustos.

La suite frontend está construida con **React, Vite y Tailwind CSS**, desplegada en **Vercel** y estructurada mediante una arquitectura modular basada en **Components + Features**.

---

## 🛠️ 3. Tecnologías y Nube

| Categoría | Tecnología | Detalle |
| :--- | :--- | :--- |
| **Framework UI** | React + Vite | React 18 / Vite 6 (TypeScript) |
| **Estilos** | Tailwind CSS | v3.4 (Diseño responsivo y componentes SaaS) |
| **Arquitectura** | Components + Features | Encapsulamiento modular por dominio de negocio |
| **Despliegue Cloud** | Vercel | Integración y despliegue continuo de Frontend |
| **Gestión de Proyecto** | Jira Cloud | Metodología Ágil / Sprints & Épicas (`HGV`) |

---

## 🚀 4. Planificación de Sprints (Jira Roadmap)

### Sprint 1 - Frontend (`HGV-8` a `HGV-41`)
- **Autenticación y Seguridad (US-01 a US-05)**: Registro de propietario, inicio/cierre de sesión, recuperación de clave y protección de rutas por rol.
- **Perfil y Pacientes (US-06 a US-10)**: Perfil de usuario y gestión completa de mascotas.
- **Agendamiento de Citas (US-11 a US-18)**: Citas, especialidades, disponibilidad de veterinarios y detalle de atenciones.
- **Panel Veterinario (US-19 a US-25)**: Historial clínico, agenda diaria, registro de diagnósticos y tratamientos, estados de atenciones.
- **Panel de Administración (US-26 a US-31)**: Dashboard de estadísticas, gestión de veterinarios, especialidades, roles y permisos.
- **Servicios Adicionales (US-32 a US-34)**: Módulo de notificaciones, recordatorios y sistema de valoraciones del servicio.

### Sprint 3 - Integración Frontend / Backend (`HGV-68` a `HGV-76`)
- Conexión de servicios API REST con el Backend Spring Boot.
- Integración de flujos de Autenticación JWT, Perfil, Citas, Consultas Médicas y Administración.
- Manejo global de errores, interceptores HTTP y configuración de CORS.

### Sprint 4 - Pruebas y Despliegue (`HGV-80` a `HGV-84`)
- **QA-04 / QA-05**: Pruebas de interfaz de usuario, validaciones de formularios y resolución de deuda técnica.
- **DEPLOY-01 (HGV-82)**: Build y despliegue automatizado del Frontend en Vercel.
- **DEPLOY-03 (HGV-84)**: Verificación integral en producción y entrega final.

---

## 🎯 5. Épicas del Proyecto (`HGV`)

1. **EPIC-01 (`HGV-1`)**: Autenticación y Seguridad (Auth, JWT, RBAC)
2. **EPIC-02 (`HGV-2`)**: Gestión de Perfil y Mascotas (Clientes y Pacientes)
3. **EPIC-03 (`HGV-3`)**: Agendamiento y Citas Médicas
4. **EPIC-04 (`HGV-4`)**: Portal del Propietario (Citas, Historial Clínico, Recordatorios)
5. **EPIC-05 (`HGV-5`)**: Panel Veterinario (Agenda Diaria, Diagnósticos, Atenciones)
6. **EPIC-06 (`HGV-6`)**: Panel de Administración (Gestión General, Roles, Estadísticas)
7. **EPIC-07 (`HGV-7`)**: Notificaciones y Valoraciones del Servicio

---

## 📁 6. Arquitectura del Proyecto (Components + Features)

```text
src/
├── assets/              # Recursos estáticos (imágenes, logos, iconos)
├── components/          # Componentes globales compartidos
│   ├── layout/          # Estructuras globales (Sidebar, Header, DashboardLayout)
│   └── ui/              # Primitivas UI (Button, Input, Modal, Badge, Table, ToggleSwitch)
├── config/              # Configuración de clientes HTTP y variables de entorno
├── features/            # Módulos organizados por dominio funcional
│   ├── auth/            # Autenticación, Login, Contexto de Sesión, Permisos
│   ├── appointments/    # Agendamiento, Calendario y Detalle de Citas
│   ├── pets/            # Registro y Ficha de Mascotas
│   ├── medical/         # Historial Clínico, Consultas y Diagnósticos
│   ├── admin/           # Gestión de Veterinarios, Especialidades, Roles y Estadísticas
│   └── notifications/   # Notificaciones y Valoraciones de Atención
├── hooks/               # Custom hooks reutilizables
├── services/            # Servicios de consumo de API REST Spring Boot
├── types/               # Definiciones e Interfaces TypeScript
└── App.tsx              # Componente principal y Router
```

---

## ⚙️ 7. Ejecución Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Edudev2004/hd-veterinaria-frontend.git
   cd hd-veterinaria-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

---

## 🌿 8. Flujo de Trabajo (GitFlow)

- `main`: Rama de producción sincronizada con el despliegue automático en Vercel.
- `develop`: Rama de integración continua frontend.

---

## 📄 9. Licencia

Desarrollado para el curso de **Herramientas de Desarrollo (HD)** &copy; 2026.
