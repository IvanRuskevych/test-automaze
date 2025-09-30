# 🚀 Monorepo Setup Guide

This document provides a step-by-step guide for creating a **Monorepo**
with a `frontend (Vite + React + TS)` and a `backend (Express + TS)`.

---

## 📂 Project Structure

```
monorepo/
├── package.json
├── tsconfig.base.json
├── tsconfig.eslint.json
├── node_modules/
├── packages/
│   ├── frontend/      <-- frontend (Vite + React + TS)
│   └── backend/       <-- backend (Express + TS)
└── eslint.config.js
```

---

## ✅ Step 1: Initialize the Monorepo

```bash
    mkdir monorepo
    cd monorepo
    npm init -y
```

Add to `package.json`:

```json
{
    "private"    : true,
    "workspaces" : [ "packages/*" ],
    "type"       : "module"
}
```

> 💡 **Note:** Workspaces are a built-in feature of **npm** (starting from npm 7+).

---

## 🐶 Step 2: Husky + lint-staged (pre-commit)

### 📦 Installation

```bash
    yarn add -D --exact husky lint-staged
    npx husky init
```

This will create a `.husky/` folder with a `pre-commit` file.

🔧 Replace the contents of `.husky/pre-commit` with:

```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

⚙️ Create **`.lintstagedrc`**:

```json
{
    "*.{ts,tsx}" : [ "eslint --fix --max-warnings=0", "prettier --write" ]
}
```

- or add to `package.json`:

```json
{
    "lint-staged" : {
        "//1"                                                : "Run ESLint with auto-fix for JS/TS files",
        "packages/**/*.{js,jsx,ts,tsx}"                      : [ "eslint --fix --max-warnings=0" ],
        "//2"                                                : "Format other file types with Prettier",
        "packages/**/*.{json,md,mdx,yml,yaml,css,scss,html}" : [ "prettier --write" ]
    }
}
```

### 🧪 Verify Husky

```bash
    git add .
    git commit -m "test"
    # Husky will run ESLint + Prettier only for changed .ts/.tsx files
```

---

## ⚙️ Step 3: Configure TypeScript

Create **tsconfig.base.json** in the repo root:

```json
{
    // Base TypeScript configuration for all packages in the monorepo
    "compilerOptions" : {
        /* 📚 Type Definitions */
        "typeRoots"                        : [ "./src/types", "./node_modules/@types" ],
        
        /* 🧠 Strictness & Type Safety */
        "strict"                           : true, // Enable all strict type checking options
        "strictNullChecks"                 : true, // Ensure variables are not null/undefined unless specified
        "noImplicitAny"                    : true, // Disallow usage of 'any' type
        "noUnusedLocals"                   : true, // Report unused local variables
        "noUnusedParameters"               : true, // Report unused function parameters
        "noFallthroughCasesInSwitch"       : true, // Prevent fallthrough in switch statements
        "forceConsistentCasingInFileNames" : true, // Enforce consistent casing in imports
        "skipLibCheck"                     : true, // Skip type checking of declaration files for faster builds
        "isolatedModules"                  : true, // Ensure each file can be transpiled independently
        "resolveJsonModule"                : true, // Allow importing JSON files
        
        /* 🌐 Module Interop */
        "allowSyntheticDefaultImports"     : true, // Allows default imports from modules without default export
        "esModuleInterop"                  : true // Enable interoperability between CommonJS and ES modules
    },
    
    /* 📁 Files/Folders to exclude from compilation */
    "exclude"         : [ "node_modules", "dist", "**/*.spec.ts" ]
}
```

Create **tsconfig.eslint.json** in the repo root:

```json
{
    // Root ESLint TypeScript config for monorepo
    "files"      : [ ],
    
    // References to package-level ESLint configs
    "references" : [
        { "path" : "./packages/frontend/tsconfig.eslint.json" },
        { "path" : "./packages/backend/tsconfig.eslint.json" }
    ]
}
```

---

## 🎨 Step 4: Initialize the Frontend (Vite + React + TS)

```bash
    mkdir packages/frontend
    cd packages/frontend
    yarn create vite .
```

Install dependencies for path aliases and SVG components:

```bash
    yarn add vite-plugin-svgr
    yarn add -D vite-tsconfig-paths
```

🔧 Configure **vite.config.ts**:

```ts
import react from '@vitejs/plugin-react'; // Official React plugin for Vite (JSX transform, Fast Refresh)
import { defineConfig } from 'vite'; // Vite config helper
import svgr from 'vite-plugin-svgr'; // Import SVGs as React components
import tsconfigPaths from 'vite-tsconfig-paths'; // Resolve TS path aliases (~/* from tsconfig)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // Enable React JSX transform + Fast Refresh
    tsconfigPaths(), // Map ~/* aliases from tsconfig
    svgr({
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        exportType: 'default', // Default export for SVG components
        ref: true, // Forward refs
        svgo: false, // Disable SVG optimization
        titleProp: true, // Enable <svg title> support
      },
      include: '**/*.svg', // Apply to all SVG files
    }),
  ],
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React, MUI, Apollo into a separate chunks
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          apollo: ['@apollo/client', 'graphql'],
        },
      },
    },
  },
});
```

Update tsconfig settings:

- no changes: `packages/frontend/tsconfig.node.json` and `packages/frontend/tsconfig.json`
- replace: `packages/frontend/tsconfig.app.json`
- create: `packages/frontend/tsconfig.eslint.json`

📌 Example `tsconfig.node.json`:

```json
{
    "compilerOptions" : {
        /* 📂 Build Metadata */
        "tsBuildInfoFile"              : "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        // Store incremental build info
        
        /* 🎯 Target & Environment */
        "target"                       : "ES2023", // Modern JS target
        "lib"                          : [ "ES2023" ], // Standard library definitions
        "module"                       : "ESNext", // Use ES modules
        "skipLibCheck"                 : true, // Skip type check of .d.ts files for speed
        
        /* 📦 Bundler Mode (for Vite) */
        "moduleResolution"             : "bundler", // Resolve modules like bundlers do
        "allowImportingTsExtensions"   : true, // Allow explicit .ts imports
        "verbatimModuleSyntax"         : true, // Preserve ES import/export syntax
        "moduleDetection"              : "force", // Force module recognition
        "noEmit"                       : true, // Do not emit JS (build handled by Vite)
        
        /* 🧹 Linting & Safety */
        "strict"                       : true, // Enable strict mode
        "noUnusedLocals"               : true, // Disallow unused local variables
        "noUnusedParameters"           : true, // Disallow unused parameters
        "erasableSyntaxOnly"           : true, // Only syntax-level type checks
        "noFallthroughCasesInSwitch"   : true, // Prevent switch fallthrough
        "noUncheckedSideEffectImports" : true // Disallow imports with side effects
    },
    
    /* 📁 Files included */
    "include"         : [ "vite.config.ts" ] // Include Vite config for type checking
}
```

📌 Example `tsconfig.json`:

```json
{
    //References for project build
    "files"      : [ ],
    
    // Link to app and node-specific configs
    "references" : [ { "path" : "./tsconfig.app.json" }, { "path" : "./tsconfig.node.json" } ]
}
```

📌 Replace `tsconfig.app.json` with:

```json
{
    "extends"         : "../../tsconfig.base.json", // Extend root base config
    
    "compilerOptions" : {
        /* 🎯 Target & Environment */
        "target"                       : "ES2022", // Output JS target for modern browsers
        "lib"                          : [ "ES2022", "DOM", "DOM.Iterable" ],
        // Include standard libraries and DOM types
        
        /* 🔧 Module & bundler settings */
        "module"                       : "ESNext", // Use native ES modules
        "moduleResolution"             : "bundler", // Use bundler module resolution (Vite-friendly)
        "moduleDetection"              : "force", // Force TypeScript to detect modules
        "allowImportingTsExtensions"   : true, // Allow .ts imports explicitly
        "verbatimModuleSyntax"         : true, // Keep import/export syntax intact
        
        /* 📤 Output settings */
        "tsBuildInfoFile"              : "./node_modules/.tmp/tsconfig.app.tsbuildinfo", // Store incremental info
        "noEmit"                       : true, // Do not emit JS for frontend TS (Vite handles build)
        "sourceMap"                    : true, // Include source maps
        "declaration"                  : true, // Generate declaration files
        "declarationMap"               : true, // Map for declaration files
        "removeComments"               : true, // Remove comments from output
        
        /* 🧠 Strictness specific for frontend */
        "noUncheckedSideEffectImports" : true, // Avoid imports with side effects
        "erasableSyntaxOnly"           : true, // Only syntax-related type errors
        
        /* 📚 Types */
        "types"                        : [ "vite/client" ], // Vite client types for import.meta
        
        /* ⚛ JSX & React */
        "jsx"                          : "react-jsx", // Enable React 17+ JSX transform
        "useDefineForClassFields"      : true, // Correct handling of class fields
        
        /* 🔗 Path Aliases */
        "baseUrl"                      : ".", // Root for path aliases
        "paths"                        : { "~/*" : [ "./src/*" ] } // ~ maps to ./src
    },
    
    "include"         : [ "src", "vite.config.ts", "codegen.ts" ], // Source files
    "exclude"         : [ "node_modules", "dist", "**/*.spec.ts" ] // Excluded files
}
```

📌 Create `tsconfig.eslint.json`:

```json
/* This config ensures ESLint understands TypeScript paths, JSX, and Vite globals.*/

{
    "extends" : "./tsconfig.app.json", // Use main frontend TS config
    "include" : [
        "src", // Application source
        "vite.config.ts", // Vite config for linting
        "vite-env.d.ts" // Vite environment type declarations
    ]
}
```

---

## 🧹 Step 5: ESLint + Prettier (shared)

Move `packages/frontend/eslint.config.js` to the repo root as the single shared config.

Install dependencies in the root:

```bash
    yarn add -D --exact \
     @eslint/js eslint \
     @typescript-eslint/eslint-plugin @typescript-eslint/parser \
     eslint-config-prettier eslint-import-resolver-typescript \
     eslint-plugin-import eslint-plugin-prettier \
     eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh \
     globals lint-staged prettier \
     typescript typescript-eslint
```

Remove ESLint-related dependencies from `packages/frontend/package.json`:

```bash
    yarn remove \
     prettier \
     typescript typescript-eslint \
     eslint @eslint/js \
     eslint-plugin-react-hooks eslint-plugin-react-refresh \
     eslint-plugin-prettier eslint-config-prettier \
     globals
```

Update **eslint.config.js** in the root:

```js
// ==========================
// Base ESLint config for monorepo using Flat Config
// ==========================

import tsPlugin from '@typescript-eslint/eslint-plugin'; // TypeScript plugin for ESLint
import tsParser from '@typescript-eslint/parser'; // TypeScript parser
import prettierConfig from 'eslint-config-prettier'; // Disable ESLint rules that conflict with Prettier
import importPlugin from 'eslint-plugin-import'; // Checks import/export syntax, order, and extraneous deps
import prettierPlugin from 'eslint-plugin-prettier'; // Runs Prettier as ESLint plugin
import reactPlugin from 'eslint-plugin-react'; // React-specific linting rules
import reactHooks from 'eslint-plugin-react-hooks'; // Lint rules for React Hooks
import reactRefresh from 'eslint-plugin-react-refresh'; // React Refresh/HMR rules for Vite
import globals from 'globals'; // Global variables for browser and Node.js
import path from 'path'; // Node.js path utilities
import tseslint from 'typescript-eslint'; // TypeScript + ESLint integration helper
import { fileURLToPath } from 'url'; // Converts file URL to path (needed in ESM monorepo)

// ==========================
// ESLint Configuration for TypeScript/React monorepo
// ==========================
export default tseslint.config([
  // 1) Global ignores (files/folders not analyzed by ESLint)
  {
    ignores: [
      '**/.idea/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/generated/**',
    ],
  },
  
  // 2) Main config for TypeScript + React
  {
    files: ['packages/**/*.{ts,tsx,js,jsx}'], // Apply rules to these file types in packages
    
    plugins: {
      prettier: prettierPlugin, // Prettier plugin
      '@typescript-eslint': tsPlugin, // TypeScript plugin
      import: importPlugin, // Import plugin
      react: reactPlugin, // React plugin
    },
    
    extends: [
      // js.configs.recommended, // JS recommended rules (commented out: optional)
      tseslint.configs.recommended, // Recommended TypeScript ESLint rules
      reactHooks.configs['recommended-latest'], // React Hooks rules
      reactRefresh.configs.vite, // React Refresh/HMR rules for Vite
      prettierConfig, // Disable ESLint rules that conflict with Prettier
    ],
    
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      parserOptions: {
        ecmaVersion: 2020, // Modern JS syntax (optional chaining, nullish coalescing)
        sourceType: 'module', // Enable ECMAScript modules
        project: ['./packages/frontend/tsconfig.eslint.json', './packages/backend/tsconfig.eslint.json'], // Use tsconfig for type-aware linting
        tsconfigRootDir: path.resolve(path.dirname(fileURLToPath(import.meta.url))), // Resolve paths correctly in monorepo
        ecmaFeatures: { jsx: true }, // Enable JSX syntax
      },
      
      globals: {
        ...globals.browser, // Browser globals (window, document, etc.)
        ...globals.node, // Node.js globals (process, __dirname, etc.)
      },
    },
    
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error', // Disallow 'any' type
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Ignore unused function arguments starting with _
          varsIgnorePattern: '^_', // Ignore unused variables starting with _
          caughtErrorsIgnorePattern: '^_', // Ignore catch block errors starting with _
        },
      ],
      'no-unused-vars': 'off', // Disable base JS rule (duplicate with TS)
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Do not require explicit function return types
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        { 'ts-ignore': 'allow-with-description' }, // Allow @ts-ignore but require explanation
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn', // Warn on '!' non-null assertion
      '@typescript-eslint/no-unsafe-assignment': 'warn', // Warn on unsafe assignments
      '@typescript-eslint/no-unsafe-call': 'warn', // Warn on unsafe function calls
      '@typescript-eslint/no-unsafe-member-access': 'warn', // Warn on unsafe member access
      '@typescript-eslint/no-unsafe-return': 'warn', // Warn on functions returning 'any'
      
      // React rules
      // 'react/react-in-jsx-scope': 'off', // Not required in React 17+
      'react-hooks/rules-of-hooks': 'error', // Enforce rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Warn on missing dependencies in hooks
      'react/jsx-no-duplicate-props': 'error', // Disallow duplicate props in JSX
      'react/jsx-no-useless-fragment': 'warn', // Disallow unnecessary fragments
      'react/self-closing-comp': 'warn', // Require self-closing tags when possible
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' }, // Disallow unnecessary curly braces in JSX
      ],
      
      // Import rules
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal']], // Group imports
          'newlines-between': 'always', // Require newline between groups
        },
      ],
      'import/no-unresolved': 'error', // Disallow unresolved imports
      'import/no-extraneous-dependencies': 'error', // No unused dependencies
      
      // Formatting & style
      quotes: ['error', 'single', { avoidEscape: true }], // Use single quotes
      'max-len': [
        'warn',
        {
          code: 120, // Max line length
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'prettier/prettier': ['warn', { semi: true, singleQuote: true, trailingComma: 'all', endOfLine: 'auto' }], // Integrate Prettier
      
      // Other rules
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn', // Disallow console.log in prod
      'no-irregular-whitespace': 'error', // Disallow weird whitespace characters
      'no-mixed-spaces-and-tabs': 'error', // Disallow mixing spaces and tabs
    },
    
    settings: {
      // Configure import plugin to resolve TS paths and types
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // Always attempt to resolve types under `@types` packages
          project: ['tsconfig.eslint.json'], // Path to tsconfig for import resolution
        },
      },
    },
  },
]);
```

Create **.prettierrc** in the root:

```json
{
    "semi"          : true, // Always add semicolons
    "singleQuote"   : true, // Use single quotes instead of double
    "printWidth"    : 120, // Wrap lines at 120 characters
    "tabWidth"      : 2, // Indent with 2 spaces
    "trailingComma" : "all", // Add trailing commas where valid in ES5 (objects, arrays, etc.)
    "arrowParens"   : "always", // Always include parentheses around arrow function arguments
    "endOfLine"     : "lf" // Use LF for line endings
}
```

Add scripts to the root `package.json`:

```json
{
    "scripts" : {
        "prepare"         : "husky",
        "lint"            : "eslint packages/backend/src packages/frontend/src --cache",
        "lint:warn"       : "eslint packages/backend/src packages/frontend/src",
        "lint:fix"        : "eslint packages/backend/src packages/frontend/src --fix",
        "format"          : "prettier --write \"packages/{frontend,backend}/src/**/*.{json,md,mdx,yml,yaml,css,scss,html}\" --ignore-unknown",
        "format:frontend" : "prettier --write \"packages/frontend/src/**/*.{json,md,mdx,yml,yaml,css,scss,html}\"",
        "format:backend"  : "prettier --write \"packages/backend/src/**/*.{json,md,mdx,yml,yaml,css,scss,html}\""
    }
}
```

> 💡 **Note:** you can skip running the lint scripts until your backend is configured.

---

## ⚙️ Step 6: Initialize the Backend (Express + TS)

```bash
    mkdir packages/backend
    cd packages/backend
    npm init -y

    yarn add --exact cookie-parser cors dotenv express
    yarn add -D --exact \
    @types/cookie-parser @types/cors @types/express @types/node \
    concurrently cpx nodemon rimraf \
    tsc-alias tsconfig-paths tsx
```

Create the basic structure:

```bash
    mkdir src
    touch src/main.ts
    touch tsconfig.json
    touch tsconfig.eslint.json
```

📌 Replace `tsconfig.json` with:

```json
{
    "extends"         : "../../tsconfig.base.json", // Extend root base TS config
    
    "compilerOptions" : {
        /* 🎯 Target & Environment */
        "target"                 : "ES2020", // Output JS version compatible with Node 16+
        "lib"                    : [ "ES2020" ], // Standard JS library
        
        /* 🔧 Module settings for Node + ESM */
        "module"                 : "NodeNext", // Enable Node ESM support with .js extensions
        "moduleResolution"       : "NodeNext", // Correct resolution of Node ESM modules
        
        /* 📤 Output settings */
        "outDir"                 : "dist", // Output compiled JS here
        "rootDir"                : "src", // Root source folder
        "sourceMap"              : true, // Generate source maps
        "declaration"            : true, // Generate TypeScript declaration files
        "declarationMap"         : true, // Map for declaration files
        "removeComments"         : true, // Strip comments in output
        "incremental"            : false, // Do not store incremental compilation info
        
        /* 🧪 Experimental features */
        "emitDecoratorMetadata"  : true, // Enable decorator metadata (for frameworks)
        "experimentalDecorators" : true, // Enable decorator syntax
        
        /* 🔗 Path Aliases */
        "baseUrl"                : ".", // Base path for aliases
        "paths"                  : { "~/*" : [ "./src/*" ] } // ~ maps to src folder
    },
    
    /* 📁 File System Scope */
    "include"         : [ "src/**/*" ], // Include all backend TS files
    "exclude"         : [ "dist", "node_modules" ] // Exclude output and dependencies
}
```

📌 Create `tsconfig.eslint.json`:

```json
{
    "extends" : "./tsconfig.json", // Use backend TS config
    "include" : [ "src/**/*" ], // All backend TypeScript source files
    "exclude" : [ "dist", "node_modules" ] // Exclude build output & dependencies
}
```

📌 Create `src/main.ts`:

```ts
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { env } from '~/config/env.js';
import { ROUTES } from '~/shared/const/index.js';
import 'tsconfig-paths/register.js'; // Enable TS path aliases at runtime

dotenv.config(); // Load environment variables from .env

async function startServer() {
  const app = express();
  const corsOptions: CorsOptions =
    env.NODE_ENV === 'production' ? { origin: env.CLIENT_URL, credentials: true } : { origin: true, credentials: true };
  
  // ────────────────
  // Middleware
  // ────────────────
  app.use(cors(corsOptions));
  app.use(cookieParser()); // Parse cookies
  app.use(express.json()); // Parse JSON request body
  app.use(express.urlencoded({ extended: false })); // Parse URL-encoded body
  
  // ────────────────
  // Routes
  // ────────────────
  app.get(ROUTES.ROOT, (_req: Request, res: Response) => res.send('Hello from ESM!')); // TODO: Test route
  
  // ────────────────
  // Start server
  // ────────────────
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running at http://localhost:${env.PORT}${ROUTES.ROOT}`);
  });
}

// Start async server with error handling
// eslint-disable-next-line no-console
startServer().catch(console.error);
```

For `corsOptions`, create the following files:

```ts
// #1 packages/backend/src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    CLIENT_URL?: string;
  }
}
```

```ts
// #2 packages/backend/src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';
import { REGEX } from '~/shared/const/index.js';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().regex(REGEX.PORT).transform(Number).default(5000),
  CLIENT_URL: z
    .string()
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'CLIENT_URL must be a valid URL' },
    ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:');
  // eslint-disable-next-line no-console
  console.dir(z.treeifyError(parsedEnv.error), { depth: null });
  
  process.exit(1);
}

export const env = parsedEnv.data;
```

📌 Add scripts to the backend `package.json`:

```json
{
    "scripts" : {
        "dev"          : "tsx watch src/main.ts", // Run dev server with auto-reload
        "build"        : "rimraf dist && tsc && tsc-alias", // Clean, compile, fix TS path aliases
        "start"        : "node dist/main.js", // Start compiled server
        "serve"        : "concurrently \"tsc -w\" \"tsc-alias -w\" \"nodemon dist/main.js\"",
        // Dev with watch + nodemon
        "start:prod"   : "NODE_ENV=production node dist/main.js", // Start in production mode
        "copy:graphql" : "npm run copy:graphql" // (placeholder) Copy GraphQL schema
    }
}
```

---

## ✅ Recommended: LF Line Endings

Switch fully to **LF** line endings.

Configure Git globally (one-time):

```bash
  git config --global core.autocrlf input
```

This means: on commit, Git converts endings to **LF**, on checkout it leaves them unchanged.

Or, if you want full control:

```bash
  git config --global core.autocrlf false
```

Add **.gitattributes** to your repository to enforce consistent line endings for all contributors.

**Example `.gitattributes`:**

```
# ================================
# 🔹 Line endings
# ================================

# Усі текстові файли примусово зберігаємо з LF у репозиторії
* text=auto eol=lf

# ================================
# 🔹 Source code (JS/TS/React/Config)
# ================================
*.js     text eol=lf
*.jsx    text eol=lf
*.ts     text eol=lf
*.tsx    text eol=lf
*.json   text eol=lf
*.json5  text eol=lf
*.yaml   text eol=lf
*.yml    text eol=lf
*.css    text eol=lf
*.scss   text eol=lf
*.less   text eol=lf
*.html   text eol=lf
*.md     text eol=lf
*.mdx    text eol=lf
*.graphql text eol=lf
*.gql    text eol=lf

# ================================
# 🔹 Shell / Config / CI
# ================================
*.sh     text eol=lf
*.bash   text eol=lf
*.zsh    text eol=lf
*.env*   text eol=lf
Dockerfile text eol=lf

# ================================
# 🔹 Windows-only scripts
# (залишаємо CRLF, бо Windows cmd/bat цього вимагає)
# ================================
*.bat    text eol=crlf
*.cmd    text eol=crlf

# ================================
# 🔹 Binaries / assets (не чіпати line endings)
# ================================
*.png    binary
*.jpg    binary
*.jpeg   binary
*.gif    binary
*.svg    binary
*.ico    binary
*.pdf    binary
*.eot    binary
*.ttf    binary
*.woff   binary
*.woff2  binary
*.mp4    binary
*.mp3    binary
*.zip    binary
*.gz     binary
*.tar    binary
*.lock   binary
```

Convert existing files to **LF**:

```bash
    git rm --cached -r .
    git reset --hard
```

—or in WebStorm: **File → File Properties → Line Separators → LF**, then commit.

---

## 🔧 Additional backend settings

A simple CORS variant that adapts automatically to the environment (development / production).

```ts
// main.ts
/**
 * CORS configuration simple variant:
 * - Development: allow all origins
 * - Production: restrict to CLIENT_URL from .env
 */
import type { CorsOptions } from 'cors';

const corsOptions: CorsOptions =
  process.env.NODE_ENV === 'production'
    ? {
      origin: process.env.CLIENT_URL, // string | undefined (typed as string via env.d.ts)
      credentials: true,
    }
    : {
      origin: true,
      credentials: true,
    };

app.use(cors(corsOptions));
```

`.env` example:

```dotenv
# ----------------------
# Server Configuration
# ----------------------
PORT=4000

# ----------------------
# Client App (Frontend)
# ----------------------
# For local dev: http://localhost:5173
# For production: https://yourdomain.com
CLIENT_URL=http://localhost:5173

# ----------------------
# Environment
# ----------------------
# "development" | "production" | "test"
NODE_ENV=development
```

---

For typing `.env` variables, create `src/types/env.d.ts`:

```ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    CLIENT_URL?: string;
  }
}
```

---

## 📦 Final `package.json` examples

📌 **Root `package.json`:**

```json
{
    "name"            : "tmp-monorepo-base", // Monorepo root package
    "version"         : "1.0.0",
    "description"     : "Monorepo with React frontend (Vite + TS) and Express backend (TS)",
    "private"         : true, // Prevent accidental publishing to npm
    "workspaces"      : [ "packages/*" ], // Enable Yarn/PNPM workspaces
    "keywords"        : [ ],
    "author"          : "Ivan Ruskevych <fullstack.dev.goit@gmail.com>",
    "license"         : "MIT",
    "type"            : "module", // Use ESM everywhere
    
    "scripts"         : {
        "prepare"         : "husky", // Setup Git hooks
        "lint"            : "eslint packages/backend/src packages/frontend/src --cache", // Lint with cache (faster)
        "lint:warn"       : "eslint packages/backend/src packages/frontend/src", // Lint without cache (show warnings)
        "lint:fix"        : "eslint packages/backend/src packages/frontend/src --fix", // Fix lint errors automatically
        // Format non-code files
        "format"          : "prettier --write \"packages/{frontend,backend}/src/**/*.{json,md,mdx,yml,yaml,css,scss,html}\" --ignore-unknown",
        "format:frontend" : "prettier --write \"packages/frontend/src/**/*.{json,md,mdx,yml,yaml,css,scss,html}\"",
        "format:backend"  : "prettier --write \"packages/backend/src/**/*.{json,md,mdx,yml,yaml,css,scss,html}\""
    },
    
    "devDependencies" : {
        "@eslint/js"                        : "9.33.0", // ESLint base rules
        "@typescript-eslint/eslint-plugin"  : "^8.40.0",
        "@typescript-eslint/parser"         : "^8.40.0",
        "eslint"                            : "9.33.0",
        "eslint-config-prettier"            : "10.1.8", // Disable ESLint rules that conflict with Prettier
        "eslint-import-resolver-typescript" : "^4.4.4", // Resolve TS paths in ESLint
        "eslint-plugin-import"              : "^2.32.0", // Import checks
        "eslint-plugin-prettier"            : "5.5.4", // Run Prettier inside ESLint
        "eslint-plugin-react"               : "^7.37.5",
        "eslint-plugin-react-hooks"         : "5.2.0",
        "eslint-plugin-react-refresh"       : "0.4.20", // React HMR linting
        "globals"                           : "16.3.0", // Browser & Node globals
        "husky"                             : "9.1.7", // Git hooks manager
        "lint-staged"                       : "16.1.5", // Run linters on staged files
        "prettier"                          : "3.6.2", // Code formatter
        "typescript"                        : "5.9.2",
        "typescript-eslint"                 : "8.40.0" // ESLint support for TS
    }
}
```

📌 **Backend `package.json`:**

```json
{
    "name"            : "backend",
    "version"         : "1.0.0",
    "description"     : "Express backend server",
    "main"            : "main.ts",
    "type"            : "module",
    
    "scripts"         : {
        "dev"          : "tsx watch src/main.ts", // Run dev server with auto-reload
        "build"        : "rimraf dist && tsc && tsc-alias", // Clean, compile, fix TS path aliases
        "start"        : "node dist/main.js", // Start compiled server
        "serve"        : "concurrently \"tsc -w\" \"tsc-alias -w\" \"nodemon dist/main.js\"",
        // Dev with watch + nodemon
        "start:prod"   : "NODE_ENV=production node dist/main.js", // Start in production mode
        "copy:graphql" : "npm run copy:graphql" // (placeholder) Copy GraphQL schema
    },
    
    "dependencies"    : {
        "cookie-parser" : "1.4.7", // Parse cookies
        "cors"          : "2.8.5", // Enable CORS
        "dotenv"        : "17.2.1", // Load env variables
        "express"       : "5.1.0" // HTTP framework
        "zod"           : "^4.1.0"
    },
    
    "devDependencies" : {
        "@types/cookie-parser" : "1.4.9",
        "@types/cors"          : "2.8.19",
        "@types/express"       : "5.0.3",
        "@types/node"          : "24.3.0", // Node.js type definitions
        "concurrently"         : "9.2.0", // Run multiple commands in parallel
        "cpx"                  : "1.5.0", // Copy files (used for assets/schema)
        "nodemon"              : "3.1.10", // Auto-reload server
        "rimraf"               : "6.0.1", // Remove folders (cross-platform)
        "tsc-alias"            : "1.8.16", // Fix TS path aliases in compiled JS
        "tsconfig-paths"       : "4.2.0", // Resolve TS path aliases at runtime
        "tsx"                  : "4.20.4" // TS/ESM runner
    }
}
```

📌 **Frontend `package.json`:**

```json
{
    "name"            : "frontend",
    "version"         : "1.0.0",
    "description"     : "React + Vite frontend app",
    "type"            : "module",
    
    "scripts"         : {
        "dev"     : "vite", // Start dev server
        "build"   : "tsc -b && vite build", // Type-check then build
        "preview" : "vite preview" // Preview production build
    },
    
    "dependencies"    : {
        "react"            : "^19.1.1",
        "react-dom"        : "^19.1.1",
        "vite-plugin-svgr" : "^4.3.0" // Import SVGs as React components
    },
    
    "devDependencies" : {
        "@types/react"         : "^19.1.10", // React type definitions
        "@types/react-dom"     : "^19.1.7",
        "@vitejs/plugin-react" : "^5.0.0", // Vite React plugin
        "vite"                 : "^7.1.2",
        "vite-tsconfig-paths"  : "^5.1.4" // TS path aliases for Vite
    }
}
```

---

## 📝 Step 7: Create Initial Commit

After completing the setup, create your first commit:

```bash
    git add .
    git commit -m "chore: initial monorepo setup"
```

---

## 🧪 Step 8: Clone and Initialize the Monorepo

```bash
# Clone the repository
git clone https://github.com/IvanRuskevych/tmp-monorepo-base.git
cd tmp-monorepo-base

# Install all dependencies (root + workspaces)
yarn install
```

> 💡 **Note:** Running yarn install in the root will automatically install dependencies for both frontend and backend
> workspaces.
---

# 🖼️ Using SVG with Vite + SVGR

By default, Vite can load `.svg` files as static assets (image URLs).  
When you add [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr), you unlock the ability to import SVGs as *
*React components** as well.

---

## 🔧 Installation

```bash
  yarn add vite-plugin-svgr
```

Update your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
});
```

---

## 📌 Usage

There are **two ways** to use `.svg` files:

### 1. Import as Image URL (classic `<img src="..." />`)

```tsx
import viteLogo from '/vite.svg';
import reactLogo from '../assets/react.svg?url';

export const LogoImages = () => (
  <div>
    <img src={viteLogo}
         className="logo"
         alt="Vite logo" />
    <img src={reactLogo}
         className="logo react"
         alt="React logo" />
  </div>
);
```

👉 Use `?url` if you need the raw file path instead of a React component.

---

### 2. Import as React Component (recommended with SVGR)

```tsx
import { ReactComponent as ViteLogo } from '/vite.svg';
import { ReactComponent as ReactLogo } from '../assets/react.svg';

export const LogoComponents = () => (
  <div>
    <ViteLogo className="logo" />
    <ReactLogo className="logo react" />
  </div>
);
```

👉 This allows you to pass props such as `className`, `title`, or `ref` directly to the SVG component.

---

## ✅ Recommendation

- Use **React component imports** (`{ ReactComponent as ... }`) if you need to style or manipulate SVGs dynamically.
- Use **`?url` imports** if the SVG should remain a static image.  


