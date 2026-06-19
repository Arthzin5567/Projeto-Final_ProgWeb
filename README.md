# Projeto-Final_ProgWeb

Projeto acadêmico unificado desenvolvido para as disciplinas de **Programação WEB** e **Teste de Software**. O sistema consiste em uma plataforma completa para gerenciamento/venda de produtos de uma cervejaria.

---

## 🏗️ Estrutura do Projeto

O repositório está organizado em uma arquitetura de subdiretórios na raiz:

* `cliente/`: Interface SPA desenvolvida em **React** contendo as regras de negócio visuais e testes de ponta a ponta (E2E).
* `servidor/`: API REST robusta desenvolvida em **Node.js** responsável pelo ecossistema do banco de dados, rotas e testes de integração.

---

## 🛠️ Tecnologias e Ferramentas

### Frontend (`cliente/`)
* **Framework:** React
* **Framework de Testes:** Cypress (Testes de Computação de Ponta a Ponta / E2E)

### Backend (`servidor/`)
* **Ambiente de Execução:** Node.js
* **Framework de Testes:** Jest e Supertest (Testes Unitários e de Integração)

---
## 💡 Sobre o projeto 

A Mars Cervejaria é uma SPA (Single Page Application) que permite:


Clientes navegarem pelo catálogo de cervejas e realizarem compras
Administradores gerenciarem o estoque, clientes e pedidos via painel dedicado
Qualquer visitante deixar avaliações e comentários sobre os produtos


A aplicação é dividida em dois serviços independentes que precisam estar rodando simultaneamente: o backend (API REST em Node.js) e o frontend (React).

## 🚀 Como Executar o Projeto

Para rodar a aplicação localmente, certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina e siga os passos abaixo:
Pré-requisitos

Antes de começar, certifique-se de ter instalado:

Node.js v18 ou superior
npm v9 ou superior (incluído com o Node.js)
MySQL 8 ou superior

### 1. Clonar o Repositório
```bash
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
cd "Projeto cervejaria1"

Para verificar se estão instalados:
 
```bash
node --version
npm --version
mysql --version
```
 
---
 
## 🗂️ Configuração do banco de dados 
 
**1. Acesse o MySQL como root:**
 
```bash
mysql -u root -p
```
 
**2. Execute o script de criação do banco:**
 
```bash
mysql -u root -p < mars_cervejaria.sql
```
 
Esse script cria:
- O banco `mars_cervejaria`
- O usuário `usuario` com senha `12345678`
- As tabelas `usuarios`, `cervejas` e `compras`

## Configuração do backend ⚙️
 
**1. Entre na pasta do servidor:**
 
```bash
cd servidor
```
 
**2. Instale as dependências:**
 
```bash
npm install
```
## 🖼️ Configuração do frontend 
 
**1. Entre na pasta do cliente:**
 
```bash
cd client
```
 
**2. Instale as dependências:**
 
```bash
npm install
```
 
O frontend já está configurado para se comunicar com o backend em `http://localhost:3001`. Nenhuma configuração adicional é necessária para o ambiente local.
 
---
 
## 💻 Rodando a aplicação 
 
Os dois serviços precisam ser iniciados em terminais separados.
 
**Terminal 1 — Backend:**
 
```bash
cd servidor
npm start
# Servidor rodando na porta 3001
```
 
**Terminal 2 — Frontend:**
 
```bash
cd client
npm start
# Aplicação abrindo em http://localhost:3000
```
 
Acesse **http://localhost:3000** no navegador.
 
---
## 📊 Testes 
 
### Testes de integração (Jest + Supertest)📝
 
Os testes de integração **não dependem de banco de dados real**. Eles usam um banco em memória (`tests/helpers/fakeDb.js`) que simula o MySQL, garantindo isolamento total entre execuções.
 
**1. Entre na pasta do servidor:**
 
```bash
cd servidor
```
 
**2. Instale as dependências (se ainda não instalou):**
 
```bash
npm install
```
 
**3. Execute os testes:**
 
```bash
# Todos os testes de integração
npm run test:integration
 
# Todos os testes (incluindo unitários)
npm test
 
# Com relatório de cobertura de código
npm run test:coverage
```

