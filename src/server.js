import http from "http";
import { json } from "./middlewares/json.js";
import { manipuladorDeRotas } from "./routes.js";

const server = http.createServer(async (request, response) => {
  const resultado = await json(request, response);

  if (!resultado) {
    return;
  }
  manipuladorDeRotas(request, response);
});

server.listen(3333, () => {
  console.log("API rodando em http://localhost:3333");
});
