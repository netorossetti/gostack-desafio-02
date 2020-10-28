const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


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
    like: 0
  }

  repositories.push(repository)

  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex( repo => repo.id === id)
  if( repositoryIndex < 0 ){
    return response.status(400).json({erro: "Repository not found!"})
  }

  const { title, url, techs } = request.body
  const repository = repositories[repositoryIndex]
  repository.title = title
  repository.url = url
  repository.techs = techs
  repositories[repositoryIndex] = repository
  return response.status(202).json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex( repo => repo.id === id)
  if( repositoryIndex < 0 ){
    return response.status(400).json({erro: "Repository not found!"})
  }

  repositories.splice(repositoryIndex)
  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex( repo => repo.id === id)
  if( repositoryIndex < 0 ){
    return response.status(400).json({erro: "Repository not found!"})
  }

  const repository = repositories[repositoryIndex]
  repository.like++
  repositories[repositoryIndex] = repository


  return response.status(204).send()
});

module.exports = app;
