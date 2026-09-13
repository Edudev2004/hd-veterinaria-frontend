# 🐾 VetHD - Frontend Suite

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitFlow](https://img.shields.io/badge/GitFlow-Enforced-F05032?style=for-the-badge&logo=git&logoColor=white)

> **Proyecto Universitario**: Plataforma Clínica Veterinaria de Alta Definición  
> **Curso**: Herramientas de Desarrollo (**HD**)  
> **Autor**: Edudev2004 / Rommel Navarro  

---

## 📖 Descripción General

**VetHD (Herramientas de Desarrollo Veterinary Suite)** es una aplicación web SaaS moderna orientada a la gestión integral de clínicas veterinarias. La suite frontend está construida con **React, Vite y Tailwind CSS**, desplegada en **Vercel** y estructurada mediante una arquitectura modular basada en **Components + Features**.

---

## 🛠️ Tecnologías y Nube

| Categoría | Tecnología | Detalle |
| :--- | :--- | :--- |
| **Framework UI** | React + Vite | React 18 / Vite 6 (TypeScript) |
| **Estilos** | Tailwind CSS | v3.4 (Diseño responsivo y componentes modernos) |
| **Arquitectura** | Components + Features | Módulos encapsulados por dominio |
| **Despliegue Cloud** | Vercel | Integración continua para Frontend |

---

## 📁 Arquitectura del Frontend (Components + Features)

```text
src/
├── assets/              # Recursos estáticos (imágenes, logotipos, iconos)
├── components/          # Componentes globales compartidos
│   ├── layout/          # Estructuras principales (Sidebar, Header, DashboardLayout)
│   └── ui/              # Primitivas UI (Button, Input, Modal, Badge, Table, ToggleSwitch)
├── config/              # Configuración de variables de entorno y clientes API
├── features/            # Módulos funcionales organizados por características/dominio
│   ├── auth/            # Autenticación, Login, Contexto de sesión
│   ├── roles/           # Gestión de roles y matriz de permisos
│   └── users/           # Administración de usuarios del sistema
├── hooks/               # Custom hooks globales de React
├── services/            # Clientes de API REST (Backend Spring Boot)
├── types/               # Tipos e interfaces globales TypeScript
└── App.tsx              # Componente raíz y enrutador principal
```

---

## ⚙️ Ejecución Local

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

## 🌿 Flujo de Trabajo (GitFlow)

- `main`: Rama de producción sincronizada con el despliegue en Vercel.
- `develop`: Rama de integración continua de frontend.

---

## 📄 Licencia

Desarrollado para el curso de **Herramientas de Desarrollo (HD)** &copy; 2026.