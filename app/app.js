const http = require("http");
const fs = require("fs/promises");
const { v4: uuidv4 } = require('uuid');

const server = http.createServer(async (req, res) => {

    if (req.url == "/api/productos" && req.method == "GET") {
        let productos = await fs.readFile(__dirname + "/data/productos.json", "utf8");
        /* productos = JSON.parse(productos); */

        console.log(productos);

        res.setHeader("Content-Type", "application/json");
        res.end(productos);
    } else if (req.url == "/api/productos" && req.method == "POST") {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 201;

        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', async () => {
            try {
                const payload = JSON.parse(data);
                payload.id = uuidv4().slice(0, 6);
                payload.precio = Number(payload.precio);
                console.log("payload: ", payload);
    

                let dataJson = await fs.readFile(__dirname + "/data/productos.json", "utf8");

                dataJson = JSON.parse(dataJson);
                dataJson.productos.push(payload);

                //guardar el json con el nuevo producto (persistencia)

                await fs.writeFile(__dirname + "/data/productos.json", JSON.stringify(dataJson, null, 4), "utf8");


                res.statusCode = 201;
                res.end(JSON.stringify({ code: 201, message: "Producto creado." }));
            } catch (error) {
                console.log(error);
                res.statusCode = 400;
                res.end(JSON.stringify({code: 400, message: "Debe proporcionar datos válidos."}))
            }
        })


    }
    else if (req.url == "/" && req.method == "GET") {

        res.setHeader("Content-Type", "text/html");
        let vista = await fs.readFile(__dirname + "/public/index.html", "utf8");
        res.end(vista);

    } else {
        res.end("Ruta desconocida.");
    }
})

module.exports = server;