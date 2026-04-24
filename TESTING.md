# CI/CD Testing Guide

## Descripción General

Este documento describe los casos de prueba implementados para validar la funcionalidad de la aplicación.

## Configuración

El proyecto está configurado con:
- **Framework de Pruebas**: Vitest
- **Testing Library**: @testing-library/react y @testing-library/jest-dom
- **Entorno**: jsdom (simulador de navegador)
- **Linter**: ESLint

## Cómo Ejecutar Pruebas

### Ejecutar todas las pruebas una vez
```bash
npm run test
# o
bun run test
```

### Ejecutar pruebas en modo watch (observar cambios)
```bash
npm run test:watch
# o
bun run test:watch
```

### Ejecutar linting
```bash
npm run lint
```

### Construir el proyecto
```bash
npm run build
```

### Construir versión de desarrollo
```bash
npm run build:dev
```

## Casos de Prueba Implementados

### 1. **pricing.test.ts** - Pruebas de Funciones de Precios

#### `getPriceTier()`
- ✅ Retorna precio minorista para cantidades menores al mínimo
- ✅ Retorna primer precio mayorista en cantidad mínima
- ✅ Retorna mejor precio para cantidades mayores
- ✅ Calcula ARS correctamente según tasa de dólar
- ✅ Maneja cantidades muy altas

#### `formatARS()` 
- ✅ Formatea con símbolo $ y separadores de miles
- ✅ Redondea valores correctamente
- ✅ Maneja valor cero

#### `formatUSD()`
- ✅ Formatea con "U$D"
- ✅ Usa coma como separador decimal

### 2. **useCart.test.ts** - Pruebas del Hook de Carrito

#### Gestión de Carrito
- ✅ Inicializa carrito vacío
- ✅ Agrega productos al carrito
- ✅ Incrementa cantidad de productos
- ✅ Decrementa cantidad de productos
- ✅ Elimina producto cuando cantidad llega a 0
- ✅ Agrega y recupera notas en items
- ✅ Limpia el carrito completamente

#### Cálculos y Persistencia
- ✅ Calcula totales correctamente
- ✅ Persiste carrito en localStorage
- ✅ Maneja localStorage malformado sin errores

### 3. **whatsapp.test.ts** - Pruebas de Mensajes WhatsApp

#### `buildWhatsAppMessage()`
- ✅ Genera mensaje válido con detalles de productos
- ✅ Incluye múltiples productos
- ✅ Formatea mensaje correctamente
- ✅ Incluye notas personalizadas
- ✅ Maneja lista de items vacía

## Flujo de CI/CD

### GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)

El workflow se ejecuta en cada push y pull request a `main` o `develop`:

#### 1. **Lint Job**
- Instala dependencias
- Ejecuta ESLint
- ✗ Falla si hay errores de linting

#### 2. **Test Job**
- Instala dependencias
- Ejecuta pruebas con Vitest
- Sube resultados de cobertura a Codecov
- ✗ Falla si hay pruebas fallidas

#### 3. **Build Job** (depende de Lint + Test)
- Instala dependencias
- Construye proyecto para producción
- Construye versión development
- Carga artefactos de build
- ✗ Falla si hay errores de compilación

#### 4. **Deploy Preview Job** (solo en PRs)
- Descarga artefactos de build
- Comenta en el PR con estado de build

## Validaciones Ejecutadas

### Antes de Merge a Main
1. ✓ Linting sin errores
2. ✓ Todas las pruebas pasando
3. ✓ Build exitoso para producción
4. ✓ Build exitoso para development

### Errores Detectados Automáticamente
- Errores de sintaxis TypeScript
- Violaciones de ESLint
- Fallos en pruebas unitarias
- Errores en importaciones
- Cambios en tipos incompatibles

## Estructura de Pruebas

```
src/
├── lib/
│   ├── pricing.ts
│   ├── pricing.test.ts
│   ├── whatsapp.ts
│   └── whatsapp.test.ts
├── hooks/
│   ├── useCart.ts
│   └── useCart.test.ts
└── test/
    ├── setup.ts         # Configuración global
    └── example.test.ts  # Ejemplo de prueba
```

## Cómo Agregar Nuevas Pruebas

1. Crea un archivo `.test.ts` o `.spec.ts` en el mismo directorio que el código a probar
2. Usa esta estructura:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { functionToTest } from "./module";

describe("Nombre del módulo", () => {
  describe("Nombre de la función", () => {
    it("debería hacer X cosa", () => {
      // Arrange
      const input = "test";
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe("expected");
    });
  });
});
```

## Debugging de Pruebas

### Ejecutar una prueba específica
```bash
npm run test:watch -- pricing.test.ts
```

### Ver detalles de error
Las salidas de Vitest incluyen:
- Nombre de la prueba fallida
- Error esperado vs actual
- Stack trace del error
- Archivo y línea del error

## Próximos Pasos

- [ ] Agregar pruebas para componentes React principales
- [ ] Aumentar cobertura de tests a >80%
- [ ] Agregar pruebas de integración para flujos completos
- [ ] Configurar reportes de cobertura
- [ ] Agregar pruebas de E2E con Playwright/Cypress

## Contacto y Soporte

Para problemas con las pruebas, revisar:
1. Los logs de GitHub Actions
2. La output local de `npm run test`
3. Los archivos de configuración (vitest.config.ts, eslint.config.js)
