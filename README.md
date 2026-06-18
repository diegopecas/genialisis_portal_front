# GENIALISIS Landing Page

Landing page minimalista para GENIALISIS - Plataforma de Gestión Educativa para Jardines Infantiles.

## 🚀 Instalación

```bash
npm install
npm install gsap --legacy-peer-deps
```

## 🏃 Ejecutar

```bash
ng serve --port 4400
```

`http://localhost:4400`

## 📁 Estructura

```
src/app/components/genialisis/landing-genialisis/
├── landing-genialisis.component.ts
├── landing-genialisis.component.html
└── landing-genialisis.component.scss
```

## ✨ Características

- **Animaciones GSAP + ScrollTrigger**: Cajas caen al hacer scroll con hilos dorados
- **6 Secciones interactivas**:
  1. **El Problema**: Excel + WhatsApp + Cuadernos = Caos
  2. **La Solución**: 60% ahorro tiempo administrativo
  3. **8 Módulos**: Integrados (Estudiantes, Académico, Calificaciones, etc.)
  4. **¿Por Qué GENIALISIS?**: Diferenciadores únicos (Control de inventarios EXCLUSIVO)
  5. **Garantía 60 Días**: Devolución completa + datos exportados
  6. **CTA**: Agendar con un Agente
- **Modal expandible**: Click en cajas para ver información detallada
- **Responsive**: Mobile y desktop
- **Tipografía**: Inter (Google Fonts)

## 🎨 Paleta de Colores

```scss
$black: #0a0a0a;
$gold: #d4af37;
$white: #ffffff;
$background: #fafafa;
```

## 🔧 Comandos

```bash
ng serve --port 4400              # Desarrollo
npm run build                     # Build producción
tree src /F > estructura_apps.txt # Generar estructura
```

## 📦 Stack

- Angular 18 (Standalone Components)
- GSAP 3.12.5 + ScrollTrigger
- TypeScript 5.4
- SCSS

## 🗄️ Backend (Opcional)

- Puerto: 9997
- Base de datos: MySQL
- Tabla: `genialisis_contactos`
- Endpoint: `POST /api/genialisis/contactos`

## 📍 Logo

`src/assets/images/logo.png`

## 🌐 Fuentes

Agregar en `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
```

---

## Compilar producción
ng serve --port 4400       
ng build --configuration production


## Arbol
tree /F /A > estructura.txt


**GENIALISIS** - Plataforma de Gestión Educativa | Colombia


