# CI/CD Setup Completo

## Resumen

Este proyecto está configurado con:
- ✅ **Pruebas Unitarias** (Vitest)
- ✅ **Linting** (ESLint)  
- ✅ **Build Validation** (Vite)
- ✅ **GitHub Actions CI/CD** (.github/workflows/ci-cd.yml)

## Ejecución Local

### Prerequisitos
```bash
# Node.js 18+ o Bun 1.0+
node --version
# o
bun --version

# Instalar dependencias
npm install
# o
bun install
```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Testing
npm run test         # Ejecuta pruebas una sola vez
npm run test:watch   # Ejecuta pruebas en modo observación

# Linting
npm run lint         # Verifica código con ESLint

# Build
npm run build        # Build optimizado para producción
npm run build:dev    # Build para desarrollo

# Preview
npm run preview      # Previsualiza build de producción localmente
```

## Flujo de Trabajo Recomendado

### Antes de Hacer Commit

```bash
# 1. Asegurar que el código cumple con el linter
npm run lint

# 2. Ejecutar pruebas
npm run test

# 3. Probar que compila sin errores
npm run build

# 4. Si todo está bien, hacer commit
git add .
git commit -m "feat: descripción del cambio"
```

### En Pull Requests

1. Crea un branch desde `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/mi-feature
   ```

2. Realiza tus cambios y pruebas locales

3. Haz push del branch:
   ```bash
   git push origin feature/mi-feature
   ```

4. Crea un Pull Request en GitHub

5. **El CI/CD se ejecutará automáticamente**:
   - ✓ ESLint (Linting)
   - ✓ Vitest (Tests)
   - ✓ Vite Build
   - ✓ GitHub comentará el estado en el PR

6. Si pasa:
   - GitHub permitirá el merge
   - Puedes hacer merge a `develop`

7. Si falla:
   - Revisa los logs del workflow
   - Corrije los errores
   - Haz push de correcciones
   - El CI/CD se ejecutará nuevamente

## GitHub Actions Workflow

### Archivo: `.github/workflows/ci-cd.yml`

El workflow contiene 4 jobs:

#### 1️⃣ **Lint Job**
- **Trigger**: Cualquier push o PR
- **Acción**: Ejecuta ESLint
- **Falla si**: Hay errores de linting
- **Duración**: ~2 minutos

#### 2️⃣ **Test Job**
- **Trigger**: Cualquier push o PR
- **Acción**: Ejecuta todas las pruebas
- **Falla si**: Alguna prueba no pasa
- **Reporte**: Sube cobertura a Codecov
- **Duración**: ~3-5 minutos

#### 3️⃣ **Build Job**
- **Trigger**: Solo después que pasen Lint + Test
- **Acciones**:
  - Build producción (`npm run build`)
  - Build desarrollo (`npm run build:dev`)
- **Falla si**: Error de compilación
- **Artefactos**: Carga la carpeta `dist/`
- **Duración**: ~2 minutos

#### 4️⃣ **Deploy Preview Job**
- **Trigger**: Solo en Pull Requests (después de Build)
- **Acción**: Comenta en el PR
- **Comentario**: Notifica que el build fue exitoso

## Casos de Prueba

### Pruebas Implementadas

#### Funciones de Precio (`src/lib/pricing.test.ts`)
- ✓ Cálculo de tiers de precio
- ✓ Conversión de moneda (USD → ARS)
- ✓ Formatos de moneda

#### Hook useCart (`src/hooks/useCart.test.ts`)
- ✓ Agregar/remover productos
- ✓ Incrementar/decrementar cantidades
- ✓ Notas personalizadas
- ✓ Cálculo de totales
- ✓ Persistencia en localStorage

#### Generador de Mensajes WhatsApp (`src/lib/whatsapp.test.ts`)
- ✓ Formato de mensaje
- ✓ Incluir múltiples productos
- ✓ Notas personalizadas

#### Hooks de Datos (`src/hooks/`)
- ✓ useReveal
- ✓ useDolar
- ✓ useProducts

### Agregar Nuevas Pruebas

1. Crea archivo `ComponentName.test.ts` junto al componente
2. Estructura básica:

```typescript
import { describe, it, expect } from "vitest";
import { YourComponent } from "./YourComponent";

describe("YourComponent", () => {
  it("should render correctly", () => {
    // Tu test aquí
  });
});
```

3. Ejecuta con `npm run test:watch`

## Debugging en CI/CD

### Ver Logs de GitHub Actions

1. Ve a tu repositorio en GitHub
2. Click en **Actions**
3. Selecciona el workflow que falló
4. Click en el job que falló
5. Expande el paso que falló para ver los logs

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `LINT_ERROR` | ESLint encontró problema | Ejecuta `npm run lint` localmente |
| `TEST_FAIL` | Prueba no pasó | Ejecuta `npm run test` y revisa |
| `BUILD_FAIL` | Error de compilación | Ejecuta `npm run build` localmente |
| `Dependencies not found` | Lock file desactualizado | Ejecuta `npm install` |

## Deployment

### Automático en Main
Cuando haces merge a `main`:
1. ✓ Linting pasa
2. ✓ Tests pasan  
3. ✓ Build se genera
4. 🚀 Está listo para deploy

### Manual Preview
```bash
npm run build
npm run preview
```

Accede a `http://localhost:4173`

## Checklist Pre-Deploy

- [ ] Branch actualizado con `main`
- [ ] `npm run lint` sin errores
- [ ] `npm run test` todas pruebas verdes
- [ ] `npm run build` compila sin errores
- [ ] `npm run preview` funciona correctamente
- [ ] Cambios documentados en TESTING.md
- [ ] PR con descripción clara
- [ ] CI/CD workflow completo en verde ✅

## Comandos Útiles de Git

```bash
# Ver estado
git status

# Ver cambios
git diff

# Actualizar branch desde develop
git fetch origin
git merge origin/develop

# Rebase interactivo (limpiar commits)
git rebase -i HEAD~3

# Descartar cambios locales
git checkout -- .

# Stash cambios temporalmente
git stash
git stash pop
```

## Monitoreo y Cobertura

### Cobertura de Tests
- Reportes generados en: `.nyc_output/`
- Histórico en Codecov: https://codecov.io/

### Métricas Objetivo
- **Cobertura**: > 70%
- **Linting**: 0 errores
- **Build**: < 3s
- **Tests**: < 10s

## Contacto

Preguntas sobre CI/CD:
1. Revisar logs de GitHub Actions
2. Ejecutar comandos localmente
3. Revisar archivos de configuración
4. Contactar al equipo dev

---

**Última actualización**: Abril 2026
**Workflow Version**: 1.0
