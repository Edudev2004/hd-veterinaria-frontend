# Flujo de trabajo con Git (Gitflow) - Proyecto VetHD (HGV)

El equipo trabaja bajo el modelo Gitflow, adaptado a las historias de Jira (códigos HGV-XX). Esto evita que los 8 desarrolladores trabajen directo sobre la misma rama y pierdan código entre sí.

---

## ⚠️ REGLA DE ORO OBLIGATORIA
> **IMPORTANTE AL MERGEAR NO BORRAR FEATURES**
> Todas las ramas `feature/US-XX-...` deben permanecer vivas tanto en el repositorio local como en el remoto (GitHub) como evidencia del trabajo ordenado para la evaluación del profesor.

---

## 1. Definición de Ramas

| Rama | Uso y Propósito |
| :--- | :--- |
| **`main`** | Código en producción. Solo recibe merges desde `release/` o `hotfix/`, nunca directo. |
| **`develop`** | Rama de integración. Todas las feature branches terminan aquí primero. |
| **`feature/US-XX-descripción-corta`** | Una rama por tarea o historia de usuario. Ej: `feature/US-01-registro-propietario`, `feature/US-14-agendar-cita`. Nace de `develop`. **IMPORTANTE AL MERGEAR NO BORRAR FEATURES** (sirven de evidencia para el profesor). |
| **`release/sprint-N`** | Se abre al cerrar cada sprint para estabilizar antes de pasar a `main`. |
| **`hotfix/descripcion`** | Solo para arreglos urgentes directo sobre `main` (bugs en producción). |

---

## 2. Referencia Obligatoria del Esquema de BD

* **Esquema de Base de Datos:** Todo desarrollo en Frontend y Backend debe tomar estrictamente como referencia el esquema SQL definido en **`src/bd-veterinaria-hd.sql`**.
* Todas las entidades, nombres de campos (ej. `nombre`, `email`, `password_hash`, `telefono`, `direccion`, `rol`, `activo`) y tipos de datos deben alinearse a este archivo para garantizar consistencia total entre Frontend, Backend y BD.

---

## 3. Flujo de Trabajo Diario, Paso a Paso

1. Antes de empezar una historia, actualiza tu `develop` local: 
   ```bash
   git checkout develop && git pull origin develop
   ```
2. Crea tu rama desde `develop` con el formato definido: 
   ```bash
   git checkout -b feature/US-14-agendar-cita
   ```
3. Trabaja y comitea en tu rama con **mensajes atómicos y descriptivos en español** (ej. *"Agregar validación de campos obligatorios en formulario de registro"*). **SIN prefijos como feat:, fix: o chore:**.
4. Al terminar, sube tu rama: 
   ```bash
   git push origin feature/US-14-agendar-cita
   ```
5. Abre un **Pull Request hacia `develop`** (nunca directo a `main`), describiendo la historia de usuario que resuelve.
6. Al menos un compañero revisa y aprueba el PR antes de mergear.
7. Al cerrar un sprint completo, se abre `release/sprint-N` desde `develop` para estabilizar, y luego se mergea a `main`.
