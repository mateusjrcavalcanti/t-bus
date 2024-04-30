# UNIBUS - Universitary Bus

> **Nota**
> Este é apenas um projeto de pesquisa, não deve ser usado `produção`

## Instalação

Use o comando para clonar o repositório:

```bash
git clone https://github.com/mateusjrcavalcanti/t-bus.git
```

## Sobre

O projeto é composto por uma aplicação `WEB` e outra `Mobile`, estruturado em Monorepo com [Turborepo](https://turborepo.org) e contem:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ auth-proxy
  |   ├─ Nitro server to proxy OAuth requests in preview deployments
  |   └─ Uses Auth.js Core
  ├─ expo
  |   ├─ Expo SDK 49
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using NativeWind
  |   └─ Typesafe API calls using tRPC
  └─ web
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication using next-auth. **NOTE: Only for Next.js app, not Expo**
  ├─ db
  |   └─ Typesafe db calls using Prisma & Postgres
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

## Inicio Rápido

Para executar, siga os seguintes passos:

### 1. Instalando as dependencias

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env
```

### 2. Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

   ```diff
   +  "dev": "expo start --ios",
   ```

2. Run `pnpm dev` at the project root folder.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

   ```diff
   +  "dev": "expo start --android",
   ```

3. Run `pnpm dev` at the project root folder.

### 3. a) Para adicionar um novo componente de UI

Execute o script `ui-add` para adicionar um novo componente de UI component usando o `shadcn/ui` CLI:

```bash
pnpm ui-add
```

### 3. b) Para adiciona um novo Pacote

Para adicionar um novo pacote, basta executar `pnpm turbo gen init` na raiz do monorepo. Isso solicitará um nome para o pacote e se você deseja instalar quaisquer dependências para o novo pacote (é claro que você também pode fazer isso posteriormente).

O gerador configura o package.json, tsconfig.json e um index.ts, além de configurar todas as configurações necessárias para as ferramentas relacionadas ao seu pacote, como formatação, linting e verificação de tipos. Quando o pacote for criado, você estará pronto para começar a construí-lo.

## References

Este projeto foi criado usando [create-t3-app](https://github.com/t3-oss/create-t3-app).
