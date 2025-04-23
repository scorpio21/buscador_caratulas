# 🎮 Buscador de Carátulas

![Buscador de Carátulas - Banner](https://cdn.thegamesdb.net/images/original/boxart/front/130095-1.jpg)

Aplicación web moderna para buscar videojuegos y mostrar sus carátulas y detalles completos, utilizando la API oficial de TheGamesDB.

<p align="center">
  <a href="https://github.com/scorpio21" target="_blank"><img src="https://img.shields.io/badge/Autor-scorpio21-blue?style=flat-square" alt="Autor"></a>
  <a href="https://thegamesdb.net/" target="_blank"><img src="https://img.shields.io/badge/API-TheGamesDB-orange?style=flat-square" alt="TheGamesDB"></a>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT">
  <img src="https://img.shields.io/badge/React-18+-blue?style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/Vite-4+-yellow?style=flat-square" alt="Vite">
</p>

---

## ✨ Características principales

- **Búsqueda rápida** de videojuegos por nombre y plataforma.
- **Visualización de carátulas** en alta calidad.
- Modal con ficha detallada: plataforma, región, fecha de lanzamiento, jugadores, co-op, desarrollador, géneros y descripción.
- **Botón para copiar todos los datos** del juego al portapapeles.
- **Descarga directa de la carátula**.
- **Enlace a la ficha oficial** en TheGamesDB.
- Interfaz responsive y moderna con Material UI.

---

## 📸 Capturas de pantalla

<p align="center">
  <img src="https://cdn.thegamesdb.net/images/original/boxart/front/130095-1.jpg" alt="Ejemplo carátula" width="220" />
  <!-- Puedes añadir más capturas aquí -->
</p>

---

## 🚀 Instalación y uso rápido

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/scorpio21/buscador_caratulas.git
   cd buscador_caratulas
   ```

2. **Copia el archivo de variables de entorno:**
   ```bash
   cp .env.example .env
   ```

3. **Consigue tu clave pública de TheGamesDB:**
   - Regístrate en [TheGamesDB](https://thegamesdb.net/) y obtén tu API Key pública.
   - Pega tu clave en el archivo `.env`:
     ```
     VITE_THEGAMESDB_API_KEY=tu_clave_publica
     ```

4. **Instala dependencias:**
   ```bash
   npm install
   ```

5. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La app estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

---

## 🛡️ Seguridad y buenas prácticas

- El archivo `.env` **no debe subirse nunca a GitHub**. Usa `.env.example` para compartir el formato.
- Solo utiliza la clave pública en el frontend. La clave privada, si la tienes, úsala solo en backend.
- Si quieres máxima seguridad, implementa un backend proxy para ocultar la clave real.

---

## 🕹️ Tecnologías utilizadas

- **React** + **Vite** (frontend ultrarrápido)
- **Material UI** (diseño profesional y responsive)
- **Axios** (peticiones HTTP)
- **TheGamesDB API** (fuente de datos principal)

---

## 📦 Estructura del proyecto

```
├── public/
├── src/
│   ├── components/      # Componentes React (GameList, etc)
│   ├── services/        # Lógica de acceso a la API
│   └── ...
├── .env.example         # Formato de variables de entorno
├── .gitignore
├── README.md
└── package.json
```

---

## 💡 Notas adicionales

- Si la API no devuelve todos los detalles de un juego, puedes consultar la ficha oficial mediante el enlace en el modal.
- Puedes ampliar la app para buscar por género, desarrollador, año, etc. ¡Pull requests bienvenidos!
- Si quieres desplegar la app en producción (Vercel, Netlify, etc.), recuerda configurar la variable de entorno en la plataforma elegida.

---

## ❓ FAQ

### ¿Por qué algunos juegos no muestran todos los datos?
La API pública de TheGamesDB a veces no expone todos los campos que sí aparecen en la web. Siempre puedes consultar la ficha oficial con el enlace del modal.

### ¿Puedo usar mi clave privada?
No, nunca la expongas en el frontend. Solo úsala en backend para sincronizar datos o crear un mirror local.

### ¿Cómo contribuyo?
Haz un fork, crea una rama, haz tus cambios y abre un Pull Request. ¡Toda ayuda es bienvenida!

---

## 🤝 Contribución

1. Haz un fork del repositorio.
2. Crea una rama con tu funcionalidad: `git checkout -b mi-nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -am 'Añade nueva funcionalidad'`
4. Haz push a la rama: `git push origin mi-nueva-funcionalidad`
5. Abre un Pull Request.

---

## 📄 Licencia

Licencia MIT. Puedes usar, modificar y compartir libremente.

---

> Desarrollado con ❤️ por [scorpio21](https://github.com/scorpio21)
