import http from "node:http";
import "./database.js";
import { json } from "./middlewares/json.js";
import { manipuladorDeRotas } from "./routes.js";

const server = http.createServer(async (request, response) => {
  const resultado = await json(request, response);
  if (!resultado) return;

  await manipuladorDeRotas(request, response);
});

server.listen(3333, () => {
  console.log("API rodando em http://localhost:3333");
});
