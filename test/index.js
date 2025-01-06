import { Server } from "../dist/index";



const app = new Server(3000);

app.start({
    enableRateLimit: true, enableHelmet: true
})
    .then(() => console.log('Server started on port 3000'))
    .catch((r) => console.error)

let db = app.dbconnect("mongodb+srv://Black:6885012249@black.p7dqd.mongodb.net/")

    
const apiRouter = app.router();
apiRouter.get("/hi", (req, res) => res.send("hi"))
apiRouter.get('/status', (req, res) => res.send("status"))
app.useRouter('/api', apiRouter);