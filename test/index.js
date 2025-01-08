var { Server } = require("../dist/index");



const app = new Server(3000);

app.start({
    enableRateLimit: true, enableHelmet: true,
    cors: {
        enable: true,
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        jsonLimit: "500mb",       
        urlencoded: "500mb",
        allowdHeaders: ["Content-Type"], 
    }
})
    .then(() => console.log('Server started on port 3000'))
    .catch((r) => console.error)

let db = app.connectDb("mongodb+srv://Black:6885012249@black.p7dqd.mongodb.net/", {
    autoHash: {
        enable: true,
        words: ["password"]
    }
})

async function test() {
    const UserShape = await db.createShape({
        name: "users", SchemaData: {
            name: String,
            dash: String,
            password: String
        }
    })



    

    const s = await UserShape.editWI({ key: "name", value: "Yousef" }, { key: "password", value: "asdadasdads" }, 1)

    console.log(s);



}

setTimeout(() => {
    test()

},5000) // timeout for the db to connect you can handle it with any way else



// app.get("/", [/* middlewares  */], {
//     run: async (req, res) => {
//         res.send("Hello World")
//     }
// })

const express = require('express');
const Router = express.Router();

Router.get("/", [/* middlewares  */], async (req, res) => {
    res.send("Hello World")
})

app.useRouter("/api", Router)