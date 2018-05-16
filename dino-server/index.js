const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const dinosaurs = {};

const buildHTML = () => (
  `<html><head><style>img { max-width: 150px;}</style></head><body><h1>Dinoland</h1>${
    Object.keys(dinosaurs).map(dinoIndex =>
      `<div><h2> ID ${
        dinoIndex.toString()
      }: ${
        dinosaurs[dinoIndex].name
      }</h2><img src='${
        dinosaurs[dinoIndex].image_url
      }' /></div>`)
  }</body></html>`
);

app.get('/', (req, res) => {
  // console.log(buildHTML());
  res.send(buildHTML());
  // console.log('wat');
});

app.get('/dinosaurs', (req, res) => {
  res.json(dinosaurs);
});

const getNextKey = (object) => {
  let index = 0;
  // debugger;
  while (index in object) {
    index += 1;
  }
  return index;
};

app.post('/dinosaurs', (req, res) => {
  // console.log(req.body);
  const index = getNextKey(dinosaurs);
  if (!req.body.name || !req.body.image_url) {
    res
      .status(400)
      .send('A dinosaur needs a name and an image_url passed in the request body.');
    return;
  }
  dinosaurs[index] = {
    name: req.body.name,
    image_url: req.body.image_url,
  };
  res.status(201).send(index.toString());
});

app.get('/dinosaurs/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!(id in dinosaurs)) {
    res.status(404).send(`There is no dinosaur with id ${id.toString()}`);
    return;
  }

  res.json(dinosaurs[id]);
});

app.patch('/dinosaurs/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!(id in dinosaurs)) {
    res.status(404).send(`There is no dinosaur with id ${id.toString()}`);
    return;
  }

  if (req.body.name) {
    dinosaurs[id].name = req.body.name;
  }

  if (req.body.image_url) {
    dinosaurs[id].image_url = req.body.image_url;
  }

  res.status(200).send();
});

app.delete('/dinosaurs/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!(id in dinosaurs)) {
    res.status(404).send(`There is no dinosaur with id ${id.toString()}`);
    return;
  }

  Reflect.deleteProperty(dinosaurs, id);
  res.send(200);
});

app.listen(5678, () => console.log('Example app listening on port 5678!'));
