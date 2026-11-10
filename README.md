# ITSA CRM

Aplicación React con [Vite](https://vite.dev/), [Tailwind CSS v4](https://tailwindcss.com/) y las dependencias del proyecto.

## Requisitos

- Node.js 20+ (recomendado)

## Instalación

```bash
npm install
```

### Paquete privado `@itsa-develop/itsa-fe-components`

Forma parte de la lista de dependencias del proyecto (`^0.1.55`) pero **no está en el registro público de npm**. Configura el registro y credenciales de tu organización (ver `.npmrc.example`) y luego:

```bash
npm install @itsa-develop/itsa-fe-components@^0.1.55
```

## Scripts

| Comando        | Descripción              |
| -------------- | ------------------------ |
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build`| Compilación producción   |
| `npm run preview` | Vista previa del build |

## Stack incluido

- React 19, React Router 7, TanStack Query (+ DevTools), Zustand
- Tailwind CSS v4 con plugin Vite (`@tailwindcss/vite`)
- Axios, Firebase, crypto-js, humps, jspdf, pdfjs-dist, xlsx, libphonenumber-js, to-words, react-to-print

Tras instalar `@itsa-develop/itsa-fe-components`, importa sus estilos o componentes según la documentación interna del paquete.
