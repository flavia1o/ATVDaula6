# API - Desenvolvimento Web 3

API desenvolvida com Node.js e SQLite para persistir clientes, categorias, fornecedores e produtos.

## Requisitos
- Node.js instalado.
- npm.

## Como executar

1. Abra o terminal na pasta do projeto.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm start
   ```

   Para desenvolvimento, use `npm run dev`.

A API ficará disponível em `http://localhost:3333`. Na primeira execução, o sistema cria automaticamente a pasta `data` e o arquivo `data/database.sqlite`, além das tabelas necessárias.

## Rotas disponíveis

Todas as entidades possuem operações GET (listar e consultar por ID), POST (cadastrar), PUT (atualizar por ID) e DELETE (excluir por ID):

- `/clientes`
- `/categorias`
- `/fornecedores`
- `/produtos`

### Exemplos de requisições

Cadastrar cliente (`POST /clientes`):

```json
{
  "nome": "Ana Silva",
  "email": "ana@email.com",
  "telefone": "55999999999",
  "ativo": true
}
```

Listar clientes: `GET /clientes`

Cadastrar categoria (`POST /categorias`):

```json
{
  "nome": "Informática",
  "descricao": "Produtos de informática"
}
```

Cadastrar produto (`POST /produtos`):

```json
{
  "nome": "Teclado",
  "preco": 99.90,
  "categoria": "ID_DE_UMA_CATEGORIA_EXISTENTE"
}
```

O campo `categoria` do produto deve receber o ID de uma categoria já cadastrada.

## Banco de dados

A conexão e a criação das tabelas estão em `src/database.js`. O banco utiliza SQLite e cria as tabelas `clientes`, `categorias`, `fornecedores` e `produtos`. A tabela de produtos possui uma chave estrangeira que referencia categorias.

O arquivo local do banco fica em `data/database.sqlite` e está no `.gitignore`, portanto não será enviado ao repositório. Ele será criado automaticamente ao iniciar o servidor.
