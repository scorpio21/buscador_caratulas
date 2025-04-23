# 🎮 Buscador de Carátulas Retro

Aplicación web moderna y profesional para buscar videojuegos retro y mostrar sus carátulas y detalles completos, utilizando la API oficial de TheGamesDB.

<p align="center">
  <img src="/logo.svg" alt="Logo Retro" width="64" />
  <a href="https://thegamesdb.net/" target="_blank"><img src="https://img.shields.io/badge/API-TheGamesDB-orange?style=flat-square" alt="TheGamesDB"></a>
  <img src="https://img.shields.io/badge/React-18+-blue?style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/Vite-4+-yellow?style=flat-square" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT">
</p>

---

## ✨ Características principales

- **Búsqueda rápida** de videojuegos retro por nombre y plataforma.
- **Visualización de carátulas** en alta calidad.
- Modal con ficha detallada: plataforma, región, fecha de lanzamiento, jugadores, co-op, desarrollador, géneros y descripción.
- **Botón para copiar todos los datos** del juego al portapapeles.
- **Descarga directa de la carátula**.
- **Enlace a la ficha oficial** en TheGamesDB.
- Interfaz responsive y moderna con Material UI, animaciones y efecto glass.
- Selector de plataformas filtrado solo por consolas retro, ordenadas alfabéticamente y con iconos personalizados.

---

## 📸 Captura de pantalla

<p align="center">
  <img src="/logo.svg" alt="Logo Retro" width="120" />
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
   La app estará disponible en `http://localhost:3000` (o el puerto que indique tu entorno).

---

## 🛡️ Seguridad y buenas prácticas

- El archivo `.env` **no debe subirse nunca a GitHub**. Usa `.env.example` para compartir el formato.
- Solo utiliza la clave pública en el frontend.
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
│   ├── logo.svg              # Logo retro personalizado
│   ├── no-cover.png          # Imagen por defecto
│   └── platforms/            # Iconos PNG/SVG de consolas retro
├── src/
│   ├── components/           # Componentes React (GameList, PlatformComboBox, Footer)
│   ├── services/             # Lógica de acceso a la API
│   ├── App.tsx, App.css      # App principal y estilos
│   └── ...
├── .env.example              # Formato de variables de entorno
├── .gitignore
├── README.md
└── package.json
```

---

## 💡 Notas y personalización

- Solo se muestran plataformas retro, ordenadas y con iconos personalizados (añade tus PNG/SVG en `/public/platforms`).
- El mensaje “No hay juegos con estos filtros.” solo aparece tras realizar una búsqueda sin resultados.
- Puedes ampliar la app para buscar por género, desarrollador, año, etc.
- El diseño es totalmente responsive, con animaciones y efecto glass.

---

## ❓ FAQ

### ¿Por qué algunos juegos no muestran todos los datos?
La API pública de TheGamesDB a veces no expone todos los campos que sí aparecen en la web. Siempre puedes consultar la ficha oficial con el enlace del modal.

### ¿Cómo añado más consolas retro o iconos?
- Añade el PNG/SVG a `/public/platforms/` y mapea el ID en `PlatformComboBox.tsx`.
- Puedes ampliar el array de IDs retro en ese mismo archivo.

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

## 🙏 Créditos y agradecimientos

- Los datos y carátulas de videojuegos son proporcionados por [TheGamesDB.net](https://thegamesdb.net/).
- Esta app no está afiliada oficialmente a TheGamesDB, pero agradece enormemente su labor y API pública.

---

> Desarrollado con ❤️ por [scorpio21](https://github.com/scorpio21)
