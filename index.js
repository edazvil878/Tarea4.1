/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");
//Importamos el swagger-ui
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

//DEfinimos la ruta para el APIDOCS
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
    console.log(`Servidor desplegado en puerto: ${port}`);
});



//Conectamos la base de datos
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
let database = undefined;
let coleccionesConcesionario = undefined;

async function connectBD() {
    try {
        await client.connect();
        database = client.db("concesionariosDB");
        coleccionesConcesionario = database.collection("concesionarios");
    } catch (e) {
        console.error(e);
        console.log("ERROR de conexión a la BBDD");
        // Ensures that the client will close when you finish/error
        await client.close();
    } finally {
    }
}

connectBD().catch(console.error);


// --------------- CONCESIONARIOS ---------------

// Lista todos los concesionarios
app.get("/concesionarios", async (request, response) => {

    try {
        const cursor = await coleccionesConcesionario.find();
        const concesionarios = await cursor.toArray();
        response.json(concesionarios);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
});

// Añadir un nuevo concesionario
app.post("/concesionarios", async (request, response) => {

    try {
        const ResultadoInsercion = await coleccionesConcesionario.insertOne(request.body);
        response.json({ message: "ok" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }

});

// Obtener un concesionario
app.post("/concesionarios/:id", async (request, response) => {
    const concesionarioID = request.params.id;
    try {
        const concesionarioBuscado = await coleccionesConcesionario.findOne({
            _id: new ObjectId(concesionarioID),
        });
        response.json(concesionarioBuscado);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }

});

//Actualizar un concesionario
app.put("/concesionarios/:id", async (request, response) => {
    const concesionarioID = request.params.id;
    const concesionarioCambiado = request.body;
    try {
        const res = await coleccionesConcesionario.updateOne(
            { _id: new ObjectId(concesionarioID) },
            {
                $set: {
                    nombre: concesionarioCambiado["nombre"],
                    direccion: concesionarioCambiado["direccion"],
                    coches: concesionarioCambiado["coches"],
                },
            }
        );
        response.json({ message: "ok" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }

});

//Borrar un concesionario
app.delete("/concesionarios/:id", async (request, response) => {
    const concesionarioID = request.params.id;
    try {
        const concesionarioBorrado = await coleccionesConcesionario.deleteOne({
            _id: new ObjectId(concesionarioID),
        });
        response.json({ message: "ok" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }

});


// --------------- COCHES ---------------

//Devuelve todos los coches del concesionario pasado por id
app.get("/concesionarios/:id/coches", async (request, response) => {
    const concesionarioID = request.params.id;
    try {
        const concesionario = await coleccionesConcesionario.findOne({
            _id: new ObjectId(concesionarioID),
        });
        response.json(concesionario["coches"]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
});

//Añade un nuevo coche al concesionario pasado por id
app.post("/concesionarios/:id/coches", async (request, response) => {
    const concesionarioID = request.params.id;
    const nuevoCoche = request.body;
    try {
        const res = await coleccionesConcesionario.updateOne(
            { _id: new ObjectId(concesionarioID) },
            {
                $push: {
                    coches: nuevoCoche,
                },
            }
        );
        response.json({ message: "ok" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
});

//Obtiene el coche cuyo id sea cocheId, del concesionario pasado por id
app.get("/concesionarios/:id/coches/:cocheId", async (request, response) => {
    const concesionarioID = request.params.id;
    const cocheID = request.params.id;

    try {
        const concesionarios = await concesionarioCollection.findOne({
            _id: new ObjectId(concesionarioID),
        });

        let cocheEncontrado = null;
        for (let i = 0; i < concesionarios.coches.length; i++) {
            if (i == parseInt(cocheID)) {
                cocheEncontrado = concesionarios.coches[i];
            }
        }
        if (!cocheEncontrado) {
            throw "ID not found";
        }
        response.json(cocheEncontrado);

    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
});

//Actualiza el coche cuyo id sea cocheId, del concesionario pasado por id
app.put("/concesionarios/:id/coches/:cocheId", async (request, response) => {
    const concesionarioID = request.params.id;
    const cocheID = request.params.id;
    const cocheNuevo = request.body;
    try {
        const concesionarios = await concesionarioCollection.updateOne(
            { _id: new ObjectId(concesionarioID) },
            {
                $set: {
                    [`coches.${cocheID}`]: cocheNuevo,
                },
            }
        );
        response.json({ message: "ok" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
});

//Borra el coche cuyo id sea cocheId, del concesionario pasado por id
app.delete("/concesionarios/:id/coches/:cocheId", async (request, response) => {
    const concesionarioID = request.params.id;
    const cocheID = request.params.id;

    try {
        const concesionarios = await concesionarioCollection.findOne({
            _id: new ObjectId(concesionarioId),
        });

        
        let cocheEncontrado = null;
        for (let i = 0; i < concesionarios.coches.length; i++) {
            if (i == parseInt(cocheID)) {
                cocheEncontrado = concesionarios.coches[i];
            }
        }
        if (!cocheEncontrado) {
            throw "ID not found";
        }
        const res = await coleccionesConcesionario.updateOne(
            { _id: new ObjectId(concesionarioID) },
            {
                $pull: {
                    coches: { $eq: cocheEncontrado },
                },
            }
        );
        if (res.modifiedCount < 1) {
            throw "Nothing modified";
        }

        response.json({ message: "ok" });

    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
});
