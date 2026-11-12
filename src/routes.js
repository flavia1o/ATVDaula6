import { randomUUID } from "crypto";

const produtos = [];
const clientes = [];
const categorias = [];
const fornecedores = [];

export const manipuladorDeRotas = (request, response) => {
  const { method, url, body } = request;

  if (url === "/clientes" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(clientes));
  }

  if (url === "/clientes" && method === "POST") {
    const { nome, email, telefone, ativo } = body || {};

    const emailExiste = clientes.some((cliente) => cliente.email === email);

    if (emailExiste) {
      response.writeHead(409);
      return response.end(
        JSON.stringify({ erro: "Já existe um cliente com esse email." }),
      );
    }

    const novoCliente = {
      id: randomUUID(),
      nome,
      email,
      telefone,
      ativo,
    };

    clientes.push(novoCliente);

    response.writeHead(201);
    return response.end(
      JSON.stringify({
        mensagem: "Cliente cadastrado com sucesso!",
        cliente: novoCliente,
      }),
    );
  }

  const isRotaClienteComId =
    url.startsWith("/clientes/") && url.split("/").length === 3;

  if (isRotaClienteComId) {
    const id = url.split("/")[2];
    const indexCliente = clientes.findIndex((cliente) => cliente.id === id);

    if (indexCliente === -1) {
      response.writeHead(404);
      return response.end(JSON.stringify({ erro: "Cliente não encontrado." }));
    }

    if (method === "PUT") {
      const { nome, email, telefone, ativo } = body || {};

      clientes[indexCliente] = {
        ...clientes[indexCliente],
        nome: nome ?? clientes[indexCliente].nome,
        email: email ?? clientes[indexCliente].email,
        telefone: telefone ?? clientes[indexCliente].telefone,
        ativo: ativo ?? clientes[indexCliente].ativo,
      };

      response.writeHead(200);
      return response.end(
        JSON.stringify({
          mensagem: "Cliente atualizado com sucesso!",
          cliente: clientes[indexCliente],
        }),
      );
    }

    if (method === "DELETE") {
      clientes.splice(indexCliente, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  if (url === "/categorias" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(categorias));
  }

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

    if (method === "DELETE") {
      categorias.splice(indexCategoria, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  if (url === "/fornecedores" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(fornecedores));
  }

  if (url === "/fornecedores" && method === "POST") {
    const { razaoSocial, cnpj, contato } = body || {};

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

    if (method === "DELETE") {
      fornecedores.splice(indexFornecedor, 1);

      response.writeHead(204);
      return response.end();
    }
  }

  if (url === "/produtos" && method === "GET") {
    response.writeHead(200);
    return response.end(JSON.stringify(produtos));
  }

  if (url === "/produtos" && method === "POST") {
    const { nome, preco, categoria } = body || {};

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

  const isRotaProdutoComId =
    url.startsWith("/produtos/") && url.split("/").length === 3;

  if (isRotaProdutoComId) {
    const id = url.split("/")[2];
    const indexProduto = produtos.findIndex((produto) => produto.id === id);

    if (indexProduto === -1) {
      response.writeHead(404);
      return response.end(JSON.stringify({ erro: "Produto não encontrado." }));
    }

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
