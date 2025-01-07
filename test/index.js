var { Server } = require("../dist/index");



const app = new Server(3000);

app.start({
    enableRateLimit: true, enableHelmet: true
})
    .then(() => console.log('Server started on port 3000'))
    .catch((r) => console.error)

let db = app.connectDb("mongodb+srv://Black:6885012249@black.p7dqd.mongodb.net/")
async function test() {
    const UserShape = await db.createShape({
        name: "users", SchemaData: {
            name: String,
            dash: String
        }
    })
    
    
    
    const s = await UserShape.searchWI({ type: 1, key: "samy.ah", value: "asd" })

    console.log(s);
    
    
    
}

test()
