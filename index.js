/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let coches = [
  { modelo: "Clio", cv: 500, precio: 18000 },
  { modelo: "Nissan", cv: 300, precio: 20000 },
  { modelo: "Dacia", cv: 250, precio: 22000 },
  { modelo: "Ferrrari", cv: 700, precio: 200000 },
];

// Creamos el array de concesionarios
let concesionarios = [
  { nombre: "concesionario1", direccion: "la paz", coche: [coches[1], coches[3]] },
  { nombre: "concesionario2", direccion: "larga", coche: [coches[2], coches[0]] },
  { nombre: "concesionario3", direccion: "corta", coche: coches[1] },
];

// Obtener todos los coches de un concesionario
app.get("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id].coche;
  response.json({ result });
});

// Lista todos los concesionarios
app.get("/concesionarios", (request, response) => {
  response.json(concesionarios);
});

// Añadir un nuevo coche a un concesionario
app.post("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const nuevoCoche = request.body;
  concesionarios[id].coche.push(nuevoCoche);
  response.json({ message: "Coche añadido al concesionario" });
});

// Añadir un nuevo concesionario
app.post("/concesionarios", (request, response) => {
  concesionarios.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const idConcesionario = request.params.id;
  const idCoche = request.params.cocheId;

  const concesionario = concesionarios[idConcesionario];
  const cochesDelConcesionario = concesionario.coche;

  const result = cochesDelConcesionario[idCoche];

  response.json({ result });
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id];
  response.json({ result });
});

// Actualizar un coche específico de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const idConcesionario = request.params.id;
  const idCoche = request.params.cocheId;

  const concesionario = concesionarios[idConcesionario];
  const cochesDelConcesionario = concesionario.coche;

  cochesDelConcesionario[idCoche] = request.body;
  response.json({ message: "Coche actualizado en el concesionario" });
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un coche específico de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const idConcesionario = request.params.id;
  const idCoche = request.params.cocheId;

  const concesionario = concesionarios[idConcesionario];
  const cochesDelConcesionario = concesionario.coche;

  cochesDelConcesionario.splice(idCoche, 1);
  response.json({ message: "Coche borrado del concesionario" });
});

// Borrar un elemento del array concesionario
app.delete("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios = concesionarios.filter((item) => concesionarios.indexOf(item) !== id);

  response.json({ message: "ok" });
});
