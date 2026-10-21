
# 📦 Gestão de Produtos | Frontend Angular

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![REST API](https://img.shields.io/badge/API-REST-009688?style=for-the-badge)

## 📌 Sobre o projeto

O **Gestão de Produtos** é uma aplicação web desenvolvida com **Angular 21**, responsável pela interface de gerenciamento de produtos de um sistema Full Stack.

A aplicação permite cadastrar, consultar, pesquisar, editar e excluir produtos, além de acompanhar indicadores de estoque por meio de um dashboard.

O frontend consome uma API REST desenvolvida em **Java e Spring Boot**, responsável pelas regras de negócio e pela persistência dos dados em um banco PostgreSQL.

O projeto foi desenvolvido com foco na aplicação prática de conceitos de desenvolvimento Full Stack, integração entre sistemas, organização de componentes e experiência do usuário.

## 🚀 Funcionalidades

- Dashboard com indicadores de produtos, unidades em estoque e valor total do inventário
- Cadastro de produtos com formulário reativo e validações
- Listagem de produtos em tabela
- Pesquisa de produtos por nome
- Edição de produtos por meio de modal
- Exclusão de produtos com confirmação
- Notificações visuais de sucesso
- Formatação de valores monetários em real (BRL)
- Navegação entre páginas com Angular Router
- Interface responsiva
- Integração com API REST utilizando HttpClient

## 🧱 Tecnologias utilizadas

| Tecnologia | Utilização |
|------------|------------|
| Angular 21 | Framework frontend |
| TypeScript 5.9 | Desenvolvimento da aplicação |
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| Bootstrap 5.3 | Componentes visuais e interface |
| Angular Router | Navegação entre páginas |
| Reactive Forms | Formulários e validações |
| HttpClient | Comunicação HTTP com o backend |
| RxJS | Tratamento de operações assíncronas |

## 🖥️ Telas da aplicação

### Dashboard

Painel com informações gerais do estoque:

- Quantidade de produtos cadastrados
- Total de unidades disponíveis
- Valor total do inventário

### Gestão de produtos

Tela para consultar e administrar os produtos, com pesquisa por nome e ações de edição e exclusão.

### Cadastro de produtos

Formulário para registrar novos produtos, informando:

- Nome
- Preço
- Quantidade

Os dados são validados antes do envio à API.

## 🏗️ Arquitetura

```text
          Frontend
         Angular 21
              |
      Componentes e Rotas
              |
          HttpClient
              |
         HTTP / JSON
              |
              v
       API REST Java
         Spring Boot
              |
        Spring Data JPA
              |
              v
          PostgreSQL
```

O Angular é responsável pela interface e interação com o usuário. A API Spring Boot processa as requisições, aplica as regras de negócio e realiza a persistência dos produtos.

## 🔗 Integração com o backend

O frontend utiliza a API REST do projeto Gestão de Produtos.

**Repositório do backend:**

https://github.com/beatrizlima-tech/gestao-produtos-api

**URL local da API:**

```text
http://localhost:8081
```

### Principais endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/produtos` | Listar produtos |
| GET | `/api/v1/produtos/{id}` | Consultar produto por ID |
| POST | `/api/v1/produtos` | Cadastrar produto |
| PUT | `/api/v1/produtos/{id}` | Atualizar produto |
| DELETE | `/api/v1/produtos/{id}` | Excluir produto |

A documentação interativa do backend pode ser acessada pelo Swagger:

```text
http://localhost:8081/swagger-ui/index.html
```

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js em uma versão compatível com Angular 21
- npm
- Git
- Backend Gestão de Produtos em execução
- PostgreSQL configurado para o backend

### 1. Clone o repositório

```bash
git clone https://github.com/beatrizlima-tech/gestao-produtos-web.git
```

### 2. Acesse a pasta

```bash
cd gestao-produtos-web
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o backend

Antes de executar o Angular, inicie a API Spring Boot, seguindo as instruções disponíveis no repositório do backend.

A API deve estar acessível na porta `8081`.

### 5. Execute o frontend

```bash
npm start
```

### 6. Acesse no navegador

```text
http://localhost:4200
```

Com o frontend e o backend em execução, a aplicação poderá consultar e gerenciar os produtos armazenados no PostgreSQL.

## 🛠️ Build de produção

Para gerar os arquivos de distribuição:

```bash
npm run build
```

Os arquivos gerados serão disponibilizados na pasta `dist/`.

## 📚 Conceitos aplicados

- Desenvolvimento de aplicações com Angular
- Componentes standalone
- Organização por páginas e responsabilidades
- Navegação com Angular Router
- Formulários reativos e validação de dados
- Consumo de API REST com HttpClient
- Comunicação assíncrona
- Gerenciamento de estado com Signals
- Integração entre frontend e backend
- Tratamento de respostas HTTP
- Interface responsiva e experiência do usuário

## 🔮 Possíveis melhorias futuras

- Paginação na listagem de produtos
- Filtros avançados de estoque
- Testes automatizados de componentes
- Autenticação e controle de acesso
- Deploy da aplicação em ambiente de produção

## 👩‍💻 Autora

Desenvolvido por **Beatriz Lima**.

**GitHub:** https://github.com/beatrizlima-tech

**LinkedIn:** https://www.linkedin.com/in/beatrizlima-tech