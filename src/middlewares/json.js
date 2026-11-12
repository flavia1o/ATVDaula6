export async function json(req, res) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    const body = Buffer.concat(buffers).toString();

    if (body) {
      req.body = JSON.parse(body);
    } else {
      req.body = {};
    }
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ mensagem: "JSON inválido." }));
    return false;
  }

  return true;
}
