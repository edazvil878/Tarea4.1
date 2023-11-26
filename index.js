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

//Tenemos una variable concesionarios, que es un array de concesionarios. Cada concesionario tiene los atributos nombre, dirección y un listado de coches.
//Cada coche del listado tiene los atributos: el modelo de coche, cv que es la potencia del coche y precio.

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

// Lista todos los coches
app.get("/coches", (request, response) => {
  response.json(coches);
});

// Añadir un nuevo coche
app.post("/coches", (request, response) => {
  coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/coches/:id", (request, response) => {
  const id = request.params.id;
  const result = coches[id];
  response.json({ result });
});

// Actualizar un solo coche
app.put("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches = coches.filter((item) => coches.indexOf(item) !== id);

  response.json({ message: "ok" });
});
