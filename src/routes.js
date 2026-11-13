import { randomUUID } from "crypto";
import { db } from "./database.js";

// Banco de dados em memória para as demais entidades
const produtos = [];
const categorias = [];
const fornecedores = [];

export const manipuladorDeRotas = async (request, response) => {
  const { method, url, body } = request;

  // 1. READ (Listar todos os clientes)
  if (url === "/clientes" && method === "GET") {
    try {
      const clientes = await db.all("SELECT * FROM clientes");

      response.writeHead(200);
      return response.end(JSON.stringify(clientes));
    } catch (erro) {
      console.error(erro);
      response.writeHead(500);
      return response.end(
        JSON.stringify({ erro: "Erro ao buscar os clientes." }),
      );
    }
  }

  // 2. CREATE (Cadastrar um novo cliente)
  if (url === "/clientes" && method === "POST") {
    const { nome, email, telefone, ativo } = body || {};

    try {
      const clienteExistente = await db.get(
        "SELECT * FROM clientes WHERE email = ?",
        [email],
      );

      if (clienteExistente) {
        response.writeHead(409);
        return response.end(
          JSON.stringify({ erro: "Já existe um cliente com esse email." }),
        );
      }

      const id = randomUUID();

      await db.run(
        "INSERT INTO clientes (id, nome, email, telefone, ativo) VALUES (?, ?, ?, ?, ?)",
        [id, nome, email, telefone, ativo ? 1 : 0],
      );

      const novoCliente = { id, nome, email, telefone, ativo };

      response.writeHead(201);
      return response.end(
        JSON.stringify({
          mensagem: "Cliente cadastrado com sucesso!",
          cliente: novoCliente,
        }),
      );
    } catch (erro) {
      console.error(erro);
      response.writeHead(500);
      return response.end(
        JSON.stringify({ erro: "Erro ao salvar o cliente no banco de dados." }),
      );
    }
  }

  // LÓGICA PARA ROTAS DE CLIENTES COM ID
  const isRotaClienteComId =
    url.startsWith("/clientes/") && url.split("/").length === 3;

  if (isRotaClienteComId) {
    const id = url.split("/")[2];

    try {
      const cliente = await db.get("SELECT * FROM clientes WHERE id = ?", [id]);

      if (!cliente) {
        response.writeHead(404);
        return response.end(
          JSON.stringify({ erro: "Cliente não encontrado." }),
        );
      }

      // UPDATE (Atualizar um cliente)
      if (method === "PUT") {
        const { nome, email, telefone, ativo } = body || {};

        await db.run(
          "UPDATE clientes SET nome = ?, email = ?, telefone = ?, ativo = ? WHERE id = ?",
          [
            nome ?? cliente.nome,
            email ?? cliente.email,
            telefone ?? cliente.telefone,
            ativo === undefined ? cliente.ativo : ativo ? 1 : 0,
            id,
          ],
        );

        const clienteAtualizado = await db.get(
          "SELECT * FROM clientes WHERE id = ?",
          [id],
        );

        response.writeHead(200);
        return response.end(
          JSON.stringify({
            mensagem: "Cliente atualizado com sucesso!",
            cliente: clienteAtualizado,
          }),
        );
      }

      // DELETE (Deletar um cliente)
      if (method === "DELETE") {
        await db.run("DELETE FROM clientes WHERE id = ?", [id]);

        response.writeHead(204);
        return response.end();
      }
    } catch (erro) {
      console.error(erro);
      response.writeHead(500);
      return response.end(
        JSON.stringify({ erro: "Erro ao executar operação com o cliente." }),
      );
    }
  }

  // 3. READ (Listar todas as categorias)
  if (url === "/categorias" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(categorias));
  }

  // 4. CREATE (Cadastrar uma nova categoria)
  if (url === "/categorias" && method === "POST") {
    const { nome, descricao } = body || {};

    const novaCategoria = {
      id: randomUUID(),
      nome,
      descricao,
    };

    categorias.push(novaCategoria);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Categoria cadastrada com sucesso!",
        categoria: novaCategoria,
      }),
    );
  }

  // LÓGICA PARA ROTAS DE CATEGORIAS COM ID
  const isRotaCategoriaComId =
    url.startsWith("/categorias/") && url.split("/").length === 3;

  if (isRotaCategoriaComId) {
    const id = url.split("/")[2];
    const indexCategoria = categorias.findIndex(
      (categoria) => categoria.id === id,
    );

    if (indexCategoria === -1) {
      response.writeHead(404);
      return response.end(
        JSON.stringify({ erro: "Categoria não encontrada." }),
      );
    }

    // UPDATE (Atualizar uma categoria)
    if (method === "PUT") {
      const { nome, descricao } = body || {};

      categorias[indexCategoria] = {
        ...categorias[indexCategoria],
        nome: nome ?? categorias[indexCategoria].nome,
        descricao: descricao ?? categorias[indexCategoria].descricao,
      };

      response.writeHead(200);
      return response.end(
        JSON.stringify({
          mensagem: "Categoria atualizada com sucesso!",
          categoria: categorias[indexCategoria],
        }),
      );
    }

    // DELETE (Deletar uma categoria)
    if (method === "DELETE") {
      categorias.splice(indexCategoria, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  // 5. READ (Listar todos os fornecedores)
  if (url === "/fornecedores" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(fornecedores));
  }

  // 6. CREATE (Cadastrar um novo fornecedor)
  if (url === "/fornecedores" && method === "POST") {
    const { razaoSocial, cnpj, contato } = body || {};

    // Verifica se o CNPJ possui 14 caracteres
    if (String(cnpj).length !== 14) {
      response.writeHead(400);
      return response.end(
        JSON.stringify({ erro: "O CNPJ deve possuir 14 caracteres." }),
      );
    }

    const novoFornecedor = {
      id: randomUUID(),
      razaoSocial,
      cnpj,
      contato,
    };

    fornecedores.push(novoFornecedor);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Fornecedor cadastrado com sucesso!",
        fornecedor: novoFornecedor,
      }),
    );
  }

  // LÓGICA PARA ROTAS DE FORNECEDORES COM ID
  const isRotaFornecedorComId =
    url.startsWith("/fornecedores/") && url.split("/").length === 3;

  if (isRotaFornecedorComId) {
    const id = url.split("/")[2];
    const indexFornecedor = fornecedores.findIndex(
      (fornecedor) => fornecedor.id === id,
    );

    if (indexFornecedor === -1) {
      response.writeHead(404);
      return response.end(
        JSON.stringify({ erro: "Fornecedor não encontrado." }),
      );
    }

    // UPDATE (Atualizar um fornecedor)
    if (method === "PUT") {
      const { razaoSocial, cnpj, contato } = body || {};

      const cnpjAtualizado = cnpj ?? fornecedores[indexFornecedor].cnpj;

      if (String(cnpjAtualizado).length !== 14) {
        response.writeHead(400);
        return response.end(
          JSON.stringify({ erro: "O CNPJ deve possuir 14 caracteres." }),
        );
      }

      fornecedores[indexFornecedor] = {
        ...fornecedores[indexFornecedor],
        razaoSocial: razaoSocial ?? fornecedores[indexFornecedor].razaoSocial,
        cnpj: cnpjAtualizado,
        contato: contato ?? fornecedores[indexFornecedor].contato,
      };

      response.writeHead(200);
      return response.end(
        JSON.stringify({
          mensagem: "Fornecedor atualizado com sucesso!",
          fornecedor: fornecedores[indexFornecedor],
        }),
      );
    }

    // DELETE (Deletar um fornecedor)
    if (method === "DELETE") {
      fornecedores.splice(indexFornecedor, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  // 7. READ (Listar todos os produtos)
  if (url === "/produtos" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(produtos));
  }

  // 8. CREATE (Cadastrar um novo produto)
  if (url === "/produtos" && method === "POST") {
    const { nome, preco, categoria } = body || {};

    // Verifica se a categoria informada existe
    const categoriaExiste = categorias.some((item) => item.id === categoria);

    if (!categoriaExiste) {
      response.writeHead(400);
      return response.end(
        JSON.stringify({ erro: "A categoria informada não existe." }),
      );
    }

    const novoProduto = {
      id: randomUUID(),
      nome,
      preco,
      categoria,
    };

    produtos.push(novoProduto);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Produto cadastrado com sucesso!",
        produto: novoProduto,
      }),
    );
  }

  // LÓGICA PARA ROTAS DE PRODUTOS COM ID
  const isRotaProdutoComId =
    url.startsWith("/produtos/") && url.split("/").length === 3;

  if (isRotaProdutoComId) {
    const id = url.split("/")[2];
    const indexProduto = produtos.findIndex((produto) => produto.id === id);

    if (indexProduto === -1) {
      response.writeHead(404);
      return response.end(JSON.stringify({ erro: "Produto não encontrado." }));
    }

    // UPDATE (Atualizar um produto)
    if (method === "PUT") {
      const { nome, preco, categoria } = body || {};

      produtos[indexProduto] = {
        ...produtos[indexProduto],
        nome: nome ?? produtos[indexProduto].nome,
        preco: preco ?? produtos[indexProduto].preco,
        categoria: categoria ?? produtos[indexProduto].categoria,
      };

      response.writeHead(200);
      return response.end(
        JSON.stringify({
          mensagem: "Produto atualizado com sucesso!",
          produto: produtos[indexProduto],
        }),
      );
    }

    // DELETE (Deletar um produto)
    if (method === "DELETE") {
      produtos.splice(indexProduto, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  // Rota 404 (Fallback)
  response.writeHead(404);
  return response.end(
    JSON.stringify({ erro: "Rota ou método não encontrado." }),
  );
};
