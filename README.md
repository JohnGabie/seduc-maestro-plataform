# 🤖 SEDUC Maestro Platform

> Plataforma de orquestração e gerenciamento de bots para equipe interna.

A **SEDUC Maestro Platform** é um painel administrativo desenvolvido para centralizar, monitorar e controlar o ecossistema de bots da nossa equipe. O objetivo é fornecer uma visão clara do status das automações, logs de execução e ferramentas de intervenção manual.

## 📸 Screenshots

![Dashboard Preview](https://via.placeholder.com/800x400?text=Preview+do+Dashboard)

## 🚀 Funcionalidades

* **Monitoramento em Tempo Real:** Visualização do status dos bots (Online, Offline, Erro).
* **Controle de Execução:** Comandos para iniciar, pausar ou reiniciar serviços.
* **Visualização de Logs:** Acesso rápido ao histórico de atividades e erros.
* **Gestão de Configurações:** Interface amigável para alterar parâmetros dos bots sem mexer no código.
* **Interface Responsiva:** Design moderno construído com Tailwind CSS e shadcn/ui.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **[React](https://react.dev/)** - Biblioteca para construção da interface.
* **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript para tipagem estática e segurança.
* **[Vite](https://vitejs.dev/)** - Build tool rápida e leve.
* **[Tailwind CSS](https://tailwindcss.com/)** - Framework de estilização utilitária.
* **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de interface reutilizáveis e acessíveis.
* **[TanStack Query](https://tanstack.com/query/latest)** - (Se estiver usando) Para gerenciamento de estado assíncrono e requisições.

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* [Node.js](https://nodejs.org/en/) (Versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [bun](https://bun.sh/)

## 📦 Como Rodar o Projeto

Siga os passos abaixo para executar a aplicação em ambiente de desenvolvimento:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/JohnGabie/seduc-maestro-plataform.git](https://github.com/JohnGabie/seduc-maestro-plataform.git)
    ```

2.  **Entre na pasta do projeto:**
    ```bash
    cd seduc-maestro-plataform
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    bun install
    ```

4.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com base no exemplo (se houver) e configure a URL da API dos bots.
    ```env
    VITE_API_URL=http://localhost:3000
    ```

5.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    bun dev
    ```

O projeto estará rodando em `http://localhost:8080` (ou a porta indicada no terminal).

## 📂 Estrutura de Pastas

```text
src/
├── components/   # Componentes reutilizáveis (botões, cards, inputs)
├── pages/        # Páginas da aplicação (Dashboard, Configurações)
├── hooks/        # Hooks personalizados do React
├── services/     # Integração com APIs externas
├── lib/          # Utilitários e configurações (ex: utils do Tailwind)
└── App.tsx       # Componente principal
