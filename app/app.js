const http = require("http");
const fs = require("fs/promises");

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

        req.on('end', () => {
            try {
                const payload = JSON.parse(data);

                console.log("payload: ", payload);
                res.statusCode = 201;
                res.end(JSON.stringify({ code: 201, message: "Producto creado." }));
            } catch (error) {
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