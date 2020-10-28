const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/** Middleware */
function validateRepositoryId(request, response, next){
  const { id } = request.params
  if(!isUuid(id)){
    return response.status(400).json({error: "Id is not valid."})
  }

  const repositoryIndex =  repositories.findIndex( repo => repo.id === id)
  if( repositoryIndex === -1 ){
    return response.status(400).json({erro: "Repository dos not exists!"})
  }

  /* Executa o proximo widdlewares */
  return next();
}

app.use('/repositories/:id', validateRepositoryId)

// /** Functions */
// function getIndexRepositoriesById(id){
//   return repositories.findIndex( repo => repo.id === id)
// }





/** Rotas */
app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0,
  }
  repositories.push(repository)
  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  const repositoryIndex = repositories.findIndex( repo => repo.id === id)
  const repository = {
    id,
    title,
    url, 
    techs,
    likes: repositories[repositoryIndex].likes,
  };
  repositories[repositoryIndex] = repository
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex( repo => repo.id === id)
  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex( repo => repo.id === id)
  repositories[repositoryIndex].likes ++
  return response.json(repositories[repositoryIndex])
});

module.exports = app;
