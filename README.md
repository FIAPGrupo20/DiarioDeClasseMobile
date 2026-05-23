# Diário de Classe - Mobile 📱

Aplicação mobile desenvolvida com React Native e Expo para o ecossistema FIAP DiarioDeClasse. Este app permite que professores criem postagens e alunos/professores visualizem as atividades da classe.

## 🔗 Ecossistema

Este projeto faz parte de uma solução completa:

- **Backend:** [DiarioDeClasse](../DiarioDeClasse) (Node.js/MongoDB)
- **Web Frontend:** [DiarioDeClasseFront](../DiarioDeClasseFront) (React/Vite)

## 🚀 Como Executar

### 1. Pré-requisitos

- Node.js instalado.
- App **Expo Go** no seu celular ou um emulador (Android/iOS) configurado.
- O **Backend** deve estar rodando (normalmente na porta 3000).

### 2. Instalação

```bash
npm install
```

### 3. Configuração de Ambiente (.env)

O app utiliza a URL do backend via variável de ambiente. Crie ou edite o arquivo `.env` na raiz:

- **Emulador Android:** `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
- **Simulador iOS / Localhost:** `EXPO_PUBLIC_API_URL=http://localhost:3000`
- **Dispositivo Real:** `EXPO_PUBLIC_API_URL=http://seu-ip-local:3000`

### 4. Rodando o App

```bash
npx expo start
```

## 🛠️ Funcionalidades Implementadas

- **Autenticação:** Login e Registro diferencial para Aluno/Professor.
- **Persistência:** O login é mantido mesmo após fechar o app (AsyncStorage).
- **Feed de Posts:** Visualização de postagens acadêmicas.
- **Criação de Posts:** Exclusivo para perfis de Professor.

## 🔑 Credenciais de Teste (Exemplo)

_Consulte o README do Backend para criar usuários ou use os cadastrados no banco._

- **Professor:** `professor@fiap.com.br` / `123456`
- **Aluno:** `aluno@fiap.com.br` / `123456`
