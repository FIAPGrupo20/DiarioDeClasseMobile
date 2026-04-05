# Diario de Classe - Orchestrator

## 📘 Contexto do Projeto

Este repositório faz parte do **Postech - Fase 4 - Tech Challenge** do curso de Pós-Tech da FIAP. O projeto **Diario de Classe** é uma aplicação mobile desenvolvida para demonstrar conhecimentos em arquitetura de software, microfrontends e desenvolvimento escalável.

Este módulo específico é o **orchestrator** (configuração raiz) da aplicação, utilizando a arquitetura de microfrontends com [Single-SPA](https://single-spa.js.org/). Ele gerencia o carregamento e a orquestração de diferentes microfrontends em uma única aplicação.

---

## 🎯 Objetivos Principais

- Aplicar conceitos de **arquitetura mobile** e microfrontends.
- Desenvolver uma solução funcional e escalável para o Diario de Classe.
- Demonstrar boas práticas de **engenharia de software**.
- Integrar conhecimentos de **UX/UI**, **performance** e orquestração de aplicações.

---

## 📌 Critérios de Avaliação

- **Qualidade do código**: Estrutura limpa, legível e bem documentada.
- **Estrutura e organização**: Separação clara de responsabilidades e modularidade.
- **Usabilidade da aplicação**: Interface intuitiva e experiência do usuário otimizada.
- **Documentação clara e objetiva**: READMEs informativos e comentários no código.

---

## 📑 Resumo do Desafio

- **Tema:** Desenvolvimento mobile aplicado a um desafio prático (Diario de Classe).
- **Objetivo:** Consolidar conhecimentos adquiridos nas fases anteriores e aplicá-los em um projeto real.
- **Entrega:** Projeto completo conforme especificações, incluindo este orchestrator e demais módulos.

---

## Funcionalidades

- **Configuração Raiz Single-SPA**: Define as rotas e aplicações microfrontend.
- **Layout Dinâmico**: Usa `single-spa-layout` para gerenciar layouts baseados em rotas.
- **Desenvolvimento Local**: Suporte para desenvolvimento com hot-reload via Webpack Dev Server.
- **Build de Produção**: Geração de bundles otimizados para produção.

## Estrutura do Projeto

```
orchestrator/
├── babel.config.json          # Configuração do Babel para transpilação
├── package.json               # Dependências e scripts do projeto
├── webpack.config.js          # Configuração do Webpack
├── README.md                  # Documentação do projeto
└── src/
    ├── diariodeclasse-root-config.js  # Configuração raiz do Single-SPA
    ├── index.ejs               # Template HTML principal
    └── microfrontend-layout.html     # Definição do layout dos microfrontends
```

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd orchestrator
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:
```bash
npm start
```
A aplicação estará disponível em `http://localhost:9000`.

### Build de Produção

Para gerar os arquivos de produção:
```bash
npm run build
```

### Outros Comandos

- `npm run lint`: Executa o linter (ESLint) no código.
- `npm test`: Executa os testes (Jest).
- `npm run format`: Formata o código com Prettier.
- `npm run check-format`: Verifica se o código está formatado.

## Adicionando Microfrontends

Para adicionar novos microfrontends:

1. Edite o arquivo `src/microfrontend-layout.html` para definir novas rotas e aplicações.
2. Atualize o import map no `src/index.ejs` para incluir os novos microfrontends (em desenvolvimento local).
3. Para produção, configure o import map externo.

Exemplo de adição no layout:
```html
<route path="nova-funcionalidade">
  <application name="@diariodeclasse/nova-app"></application>
</route>
```

## Dependências Principais

- **single-spa**: Framework para microfrontends.
- **single-spa-layout**: Gerenciamento de layouts.
- **Webpack**: Bundler e servidor de desenvolvimento.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está sob a licença [MIT](LICENSE). <!-- Ajuste se houver uma licença específica -->

## Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

---

## 📖 Notas

- Este README serve como guia completo para o módulo orchestrator, integrando o contexto do Tech Challenge.
- Para detalhes completos do desafio, consulte o documento **Postech - Fase 4 - Tech Challenge.pdf** (se disponível no repositório principal).
- Ferramentas sugeridas: Frameworks modernos de desenvolvimento mobile, integração com APIs e uso de metodologias ágeis.