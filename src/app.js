const express = require("express");
const cors = require("cors");
const {uuid} = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const {id} = request.params;
  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if(indexRepository < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  request.indexRepository = indexRepository;

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {

  const {title, url, techs} = request.body;
  const {indexRepository} = request;

  const repository = {
    ...repositories[indexRepository],
    title,
    url,
    techs
  };

  repositories[indexRepository] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {indexRepository} = request;
  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {indexRepository} = request; 
  const repository = {
    ...repositories[indexRepository],
    likes: repositories[indexRepository].likes + 1
  };

  repositories[indexRepository] = repository;

  return response.json(repository);
});

module.exports = app;
