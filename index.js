const server = require("./app/app.js");


const main = () => {
    server.listen(3000, () => {
        console.log("Servidor escuchando en http://localhost:3000")
    })
};

main();