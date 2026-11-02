# 📦 Gestão de Produtos | Frontend Angular

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![REST API](https://img.shields.io/badge/API-REST-009688?style=for-the-badge)

## 📌 Sobre o projeto

O **Gestão de Produtos** é uma aplicação web desenvolvida com **Angular 21**, responsável pela interface de gerenciamento de produtos de um sistema Full Stack.

A aplicação permite cadastrar, consultar, pesquisar e editar produtos, além de acompanhar indicadores de estoque por meio de um dashboard.

O sistema utiliza exclusão lógica (*soft delete*), permitindo que produtos excluídos sejam enviados para uma Lixeira, com prazo de recuperação de 30 dias definido pelo backend.

O frontend consome uma API REST desenvolvida em **Java e Spring Boot**, responsável pelas regras de negócio e pela persistência dos dados em um banco PostgreSQL.

O projeto foi desenvolvido com foco na aplicação prática de conceitos de desenvolvimento Full Stack, integração entre sistemas, organização de componentes e experiência do usuário.

## 🚀 Funcionalidades

- Dashboard com indicadores de produtos, unidades em estoque e valor total do inventário
- Cadastro de produtos com formulário reativo e validações
- Listagem de produtos em tabela
- Pesquisa de produtos por nome
- Edição de produtos por meio de modal
- Exclusão lógica de produtos com confirmação em duas etapas
- Página de Lixeira com listagem de produtos excluídos
- Exibição de descrição, preço, quantidade e prazo restante na Lixeira
- Estados de carregamento, erro e lixeira vazia
- Notificações visuais de sucesso nas operações implementadas
- Formatação de valores monetários em real (BRL)
- Navegação entre páginas com Angular Router e Lazy Loading
- Ícones com Lucide para Angular
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
| Lucide | Ícones da interface |
| Angular Router | Navegação e carregamento sob demanda |
| Reactive Forms | Formulários e validações |
| HttpClient | Comunicação HTTP com o backend |
| RxJS | Tratamento de operações assíncronas |
| Angular Signals | Gerenciamento de estado da interface |

## 🖥️ Telas da aplicação

### Dashboard

Painel com informações gerais do estoque:

- Quantidade de produtos cadastrados
- Total de unidades disponíveis
- Valor total do inventário

### Gestão de produtos

Tela para consultar e administrar os produtos ativos.

Permite pesquisar produtos por nome, editar informações e enviar produtos para a Lixeira.

O processo de exclusão lógica possui confirmação em duas etapas, oferecendo maior segurança ao usuário.

### Cadastro de produtos

Formulário para registrar novos produtos, informando:

- Nome
- Descrição (opcional)
- Preço
- Quantidade

Os dados são validados antes do envio à API.

### Lixeira de produtos

Página disponível na rota `/lixeira`, integrada ao backend para consultar produtos excluídos logicamente.

Funcionalidades implementadas:

- Listagem dos produtos excluídos
- Exibição de nome, descrição, preço e quantidade
- Contador de produtos na Lixeira
- Cálculo dos dias restantes a partir da data de exclusão retornada pela API
- Estados de carregamento, erro e ausência de produtos
- Interface em tema escuro com ícones Lucide


**Status atual:**

A Lixeira está funcional e integrada à API REST desenvolvida em Java e Spring Boot.

As seguintes operações estão implementadas:

- Exclusão lógica de produtos, mantendo os registros disponíveis para recuperação.
- Restauração de produtos dentro do prazo de 30 dias.
- Exclusão definitiva de produtos, com confirmação em duas etapas.
- Bloqueio da restauração quando o prazo de recuperação está encerrado.
- Atualização da listagem após as operações.
- Exibição de notificações de sucesso e mensagens de erro.

As funcionalidades de exclusão lógica, restauração e exclusão definitiva foram validadas manualmente com o frontend, a API e o PostgreSQL.

**Melhorias previstas:**

- Exibir a data de exclusão de cada produto.
- Atualizar automaticamente o prazo restante enquanto a página permanece aberta.

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

O Angular é responsável pela interface e interação com o usuário.

A API Spring Boot processa as requisições, aplica as regras de negócio e realiza a persistência dos produtos.

O carregamento das páginas utiliza **Lazy Loading**, permitindo que os componentes sejam carregados conforme a navegação.

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
| GET | `/api/v1/produtos` | Listar produtos ativos |
| GET | `/api/v1/produtos/{id}` | Consultar produto por ID |
| POST | `/api/v1/produtos` | Cadastrar produto |
| PUT | `/api/v1/produtos/{id}` | Atualizar produto |
| DELETE | `/api/v1/produtos/{id}` | Mover produto para a Lixeira |
| GET | `/api/v1/produtos/lixeira` | Listar produtos excluídos |
| PATCH | `/api/v1/produtos/{id}/restaurar` | Restaurar produto |
| DELETE | `/api/v1/produtos/{id}/definitivo` | Excluir produto definitivamente |


**Integração com o backend:**

As operações de restauração e exclusão definitiva estão integradas à API REST e podem ser executadas diretamente pela interface Angular.

- **Restauração:** utiliza o endpoint `PATCH /api/v1/produtos/{id}/restaurar`, respeitando o prazo de recuperação de 30 dias definido pelo backend.
- **Exclusão definitiva:** utiliza o endpoint `DELETE /api/v1/produtos/{id}/definitivo`, removendo permanentemente o registro.
- **Segurança das operações:** ambas possuem confirmação na interface, tratamento de erros e notificações de sucesso.

As operações foram verificadas em testes manuais com o Angular, Spring Boot e PostgreSQL.


A documentação interativa da API pode ser acessada pelo Swagger:

```text
http://localhost:8081/swagger-ui/index.html
```


## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js em versão compatível com Angular 21
- npm
- Git
- Backend Gestão de Produtos em execução
- PostgreSQL configurado para o backend

### 1. Clone o repositório

```bash
git clone https://github.com/beatrizlima-tech/gestao-produtos-web.git
```

### 2. Acesse a pasta do projeto

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

Para consultar a Lixeira diretamente:

```text
http://localhost:4200/lixeira
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
- Lazy Loading
- Formulários reativos e validação de dados
- Consumo de API REST com HttpClient
- Comunicação assíncrona
- Gerenciamento de estado com Angular Signals
- Integração entre frontend e backend
- Tratamento de respostas HTTP
- Exclusão lógica (*soft delete*)
- Cálculo de prazo de recuperação
- Interface responsiva e experiência do usuário
- Versionamento de código com Git e GitHub


## 🚧 Funcionalidades em desenvolvimento

- Exibir a data real de exclusão de cada produto na Lixeira.
- Atualizar automaticamente o prazo restante de recuperação enquanto a página permanece aberta.
- Refinar as validações e os feedbacks das operações de edição.
- Ampliar a cobertura de testes automatizados.

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