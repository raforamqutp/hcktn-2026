# VecinOS

Plataforma web hiperlocal para economía barrial, cadena de favores solidarios y coordinación de soporte ante emergencias.

## Requisitos y Ejecución

```bash
npm install
npm run dev
```

Para compilar la versión de producción:

```bash
npm run build
```

## Estructura de Módulos

- `src/types/index.ts`: Definición de modelos e interfaces compartidas.
- `src/context/AppContext.tsx`: Estado global, cálculo ponderado de reputación y sincronización local.
- `src/features/services/`: Directorio de oficios y emprendimientos locales con sistema de calificación y trueque.
- `src/features/favors/`: Cadena de favores, préstamos comunitarios y pool escolar.
- `src/features/emergency/`: Tablero de ayuda humanitaria, recursos críticos y soporte offline/SMS.
- `src/components/map/`: Mapa interactivo geolocalizado del barrio.
- `src/components/publish/`: Publicación rápida en tres pasos.
- `src/components/auth/`: Validación de identidad por DNI.
- `src/components/tutorial/`: Guía de inicio rápido.
