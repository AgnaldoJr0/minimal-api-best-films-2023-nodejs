import fastify from "fastify";
var cors = require("cors");

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

const films = [
  {
    id: 1,
    title: "Barbie",
    director: "Greta Gerwig",
    genre: "Fantasia/Comédia",
    releaseYear: 2023,
    synopsis:
      "Uma comédia de fantasia que explora temas de identidade e feminismo através da icônica boneca.",
    platforms: ["HBO Max"],
  },
  {
    id: 2,
    title: "Oppenheimer",
    director: "Christopher Nolan",
    genre: "Drama/Biografia",
    releaseYear: 2023,
    synopsis:
      "Uma história envolvente sobre J. Robert Oppenheimer e a criação da bomba atômica.",
    platforms: ["Aluguel Digital"],
  },
  {
    id: 3,
    title: "Suzume",
    director: "Makoto Shinkai",
    genre: "Animação/Fantasia",
    releaseYear: 2023,
    synopsis:
      "Um anime que segue a jornada de uma jovem para fechar portas místicas que causam devastação.",
    platforms: ["Crunchyroll"],
  },
  {
    id: 4,
    title: "Dungeons & Dragons: Honra Entre Rebeldes",
    director: "Jonathan Goldstein, John Francis Daley",
    genre: "Aventura/Fantasia",
    releaseYear: 2023,
    synopsis:
      "Um grupo de aventureiros embarca em uma missão para recuperar uma relíquia perdida.",
    platforms: ["Paramount+"],
  },
  {
    id: 5,
    title: "Assassinos da Lua das Flores",
    director: "Martin Scorsese",
    genre: "Drama/Crime",
    releaseYear: 2023,
    synopsis:
      "Uma exploração intensa dos assassinatos dos Osage na América dos anos 1920.",
    platforms: ["Aluguel Digital"],
  },
];

server.get("/films", async (request, response) => {
  response.type("aplication/json").code(200);
  return { films };
});

interface FilmsParams {
  id: string;
}

server.get<{ Params: FilmsParams }>("/films/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const film = films.find((f) => f.id === id);

  if (!film) {
    response.type("aplication/json").code(404);
    return { message: "Film Not Found" };
  } else {
    response.type("aplication/json").code(200);
    return { film };
  }
});

server.delete<{ Params: FilmsParams }>(
  "/films/:id",
  async (request, response) => {
    const id = parseInt(request.params.id);
    const film = films.find((f) => f.id === id);

    if (!film) {
      response.type("aplication/json").code(404);
      return { message: "Film Not Found" };
    } else {
      films.splice(films.indexOf(film), 1);
      response.type("aplication/json").code(200);
      return { message: "Film Deleted" };
    }
  }
);

interface FilmsModel {
  id: number;
  title: string;
  director: string;
  genre: string;
  releaseYear: number;
  synopsis: string;
  platforms: string[];
}

server.put<{ Params: FilmsParams; Body: FilmsModel }>(
  "/films/:id",
  async (request, response) => {
    const id = parseInt(request.params.id);
    const filmIndex = films.findIndex((f) => f.id === id);
    const bodyValue = request.body;

    if (filmIndex !== -1) {
      films[filmIndex] = { ...films[filmIndex], ...bodyValue };
      return response.code(200).send(films[filmIndex]);
    } else {
      return response.code(404).send({ error: "Film not found" });
    }
  }
);

server.post<{ Body: FilmsModel }>(
  "/films",
  async (request, response) => {
    const bodyValue = request.body;
    const exists = films.some((f) => f.id === bodyValue.id);

    if (!exists) {
      films.push(bodyValue);
      return response.code(201).send(bodyValue);
    } else {
      return response.code(409).send({ error: "Film already exists" });
    }
  }
);

server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
