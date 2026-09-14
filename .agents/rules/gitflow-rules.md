# Reglas de GitFlow y Commits por Historia de Usuario (US)

Este documento define las reglas de flujo de trabajo para el desarrollo del proyecto VetHD.

---

## 1. Mapeo Estricto: 1 US = 1 Rama Feature
* Por cada Historia de Usuario (US) de Jira, se creará una única rama `feature` desde `develop`.
* **Formato de rama:** `feature/US-XX-nombre-corto`
  * Ejemplo para US-01: `feature/US-01-registro-propietario`
  * Ejemplo para US-02: `feature/US-02-inicio-sesion`
  * Ejemplo para US-03: `feature/US-03-cierre-sesion`
  * Ejemplo para US-04: `feature/US-04-proteccion-rutas`
  * Ejemplo para US-05: `feature/US-05-recuperacion-password`

---

## 2. Aislamiento de Código por US (Strict Scope)
* **Queda prohibido incluir código de otras Historias de Usuario en la rama de una US.**
* En la rama `feature/US-01-registro-propietario` **solo** debe existir el código del registro de propietarios (US-01).
* Las pantallas de Login (US-02), Cierre de sesión (US-03), Protección de rutas (US-04) y Recuperación (US-05) se crearán en sus respectivas ramas individuales.

---

## 3. Formato y Calidad de Commits
* **Commits Atómicos:** Un cambio lógico por commit.
* **Mensajes en Español:** Descriptivos, concisos y profesionales.
* **SIN PREFIJOS:** No utilizar `feat:`, `fix:`, `chore:`, `refactor:`.
* *Ejemplo:* `Implementar formulario de registro de propietario con validaciones`

---

## 4. Flujo de Trabajo
1. `git checkout develop`
2. `git checkout -b feature/US-XX-nombre-corto`
3. Desarrollar únicamente los archivos concernientes a esa US.
4. Commitear de forma atómica en español.
5. Subir la rama: `git push origin feature/US-XX-nombre-corto`
6. Fusionar hacia `develop`.
