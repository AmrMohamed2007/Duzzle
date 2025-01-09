# Duzzle Library

This library provides a utility for managing MongoDB schemas and interacting with them using a clean and structured interface. It includes two core classes: `Shape` and `App`, each extending the `EventEmitter` class for event-driven programming. The package allows you to dynamically define schemas using the `createShape` function, with the schema data being directly represented by the `Shape` class.

## Installation

Install the package using npm:
```bash
npm install duzzle
```

## Usage

### Setting up the `App` Class
The `App` class handles the database connection and manages different `Shape` instances.

```typescript
import { App } from 'duzzle';

// Create a new instance of App
const app = new App('mongodb://localhost:27017/mydatabase');

// Connect to the database
app.connect().then(() => {
    console.log('Connected to the database!');
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});

// Disconnect when done
app.disconnect().then(() => {
    console.log('Disconnected from the database!');
});
```

### Dynamically Creating Shapes with `App`
The `createShape` function allows you to dynamically define schemas and manage them through `Shape` instances.

```typescript
import { ShapeAdd } from 'duzzle';

const shapeOptions: ShapeAdd = {
    name: 'Product',
    SchemaData: {
        title: String,
        price: Number,
        products: [{name: String, price: Number}]
    }
};

const shape = await app.createShape(shapeOptions)

    shape.searchWI({ key: 'title', value: 'Laptop', type: 1 }).then(result => {
        console.log('Product search results:', result);
    });

     shape.searchWI({ key: 'products.name', value: 'Laptop', type: 1 }).then(result => {
        console.log('Product search results:', result);
    });
```

### Create A HTTP Server
the `start` function it stats a server with port you provided in `parametar`

```typescript
import { Server } from "duzzle"

const app = new Server(300* /* Server Port */)


// Strat the http server

 app.start()
    .then(() => console.log('Server started on port 3000'))
    .catch((r) => console.error)

 // server with security options:

 app.start({
    enableRateLimit: true, enableHelmet: true,
    cors: {
        enable: true,
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        jsonLimit: "500kb",       
        urlencoded: "500mb",
        allowdHeaders: ["Content-Type"], 
    }
})
    .then(() => console.log('Server started on port 3000'))
    .catch((r) => console.error)

// [get, delete, put, patch, post...]
    app.get("/hello", [/*middlewares if no put it empty arr*/], {
        run: (req, res) => {
            res.send("hello world")
        }
    })

    // create a route
    const Route = app.Route()
    
    Route.get("/", (req, res) => res.send("hi"))

    app.useRouter("/main", Route)

```

### Connect To Duzzle Db Using HTTP Server
```typescript

let db = await app.connectDb("mongodb+srv://Black:6885012249@black.p7dqd.mongodb.net/")

// Security Options

let db = await app.connectDb("mongodb+srv://Black:6885012249@black.p7dqd.mongodb.net/", {
    autoHash: {
        enable: true,
        words: ["password"]
    }
})
```


### Create Shape In HTTPS Server

```typescript

    const UserShape = await db.createShape({
        name: "users", SchemaData: {
            name: String,
            dash: String,
            password: String
        }
    }) 

// Insert Function

await UserShape.model.insertMany(...[
    {name: "ahmed", products: [{name:"mouse", price:15}] /* Document */}, {name: "amr" , products: [{name:"mouse", price:15}]}
    ])


    // Edit With Item
   

 const S = await UserShape.editWI({ key: "name", value: "amr" }, { key: "products.name", value: "keyboard" }, 1)
```

## API Reference

### Class: `Shape`
#### Constructor
```typescript
new Shape(name: string, schemaData: Record<string, unknown>); // <Promise<Shape>
```
- `name`: The name of the shape.
- `schemaData`: The schema definition as a record of fields and their types.

#### Methods
- `searchWI(options: Query): Promise<Document | Document[] | null>`
  - Searches the database using the given query.

- `editWI(filter: QueryU, update: QueryUpdate | Record<string, unknown>, type: TOSU, options?: Uptions): Promise<Document | Document[] | UpdateWriteOpResult | null>`
  - Edits documents in the database based on the filter and update instructions.

  - `model`
  - Returns Schema's Model in mongoose


### Class: `App`
#### Constructor
```typescript
new App(url: string, {
    autoHash: {
        enable: true,
        words: ["password"]
    }
});
```
- `url`: MongoDB connection string.
- `extentions`: Some extentions to make a db easier

#### Methods
- `connect(): Promise<void | mongoose.Mongoose>`
  - Connects to the MongoDB database.

- `disconnect(): Promise<void>`
  - Disconnects from the database.

- `createShape(options: ShapeAdd): Promise<Shape>`
  - Dynamically defines a new schema and returns a `Shape` instance.


## Types and Interfaces

### Interface: `ShapeAdd`
```typescript
interface ShapeAdd {
    name: string;
    SchemaData: Record<string, unknown>;
}
```
- `name`: The name of the schema to be created.
- `SchemaData`: The schema definition as a record of fields and their types.

### Interface: `Query`
```typescript
interface Query {
    key?: string;
    value: any;
    type: TOSN;
}
```
- `key`: The field to query.
- `value`: The value to search for.
- `type`: Type of query (`TOSN` enum).

### Interface: `QueryU`
```typescript
interface QueryU {
    key?: string;
    value: any;
}
```
- `key`: The field to filter by.
- `value`: The filter value.

### Interface: `QueryUpdate`
```typescript
interface QueryUpdate {
    key: string;
    value: any;
}
```
- `key`: The field to update.
- `value`: The new value for the field.

### Interface: `Uptions`
```typescript
interface Uptions {
    createNew?: boolean;
    arrayMethod?: "push" | "pop" | "set";
}
```
- `createNew`: Whether to create a new document if no match is found.
- `arrayMethod`: Method to apply when updating array fields.

### Enum: `TOSU`
```typescript
enum TOSU {
    all = 0,
    one = 1
}
```
- `all`: Apply to all matching documents.
- `one`: Apply to a single matching document.

### Enum: `TOSN`
```typescript
enum TOSN {
    all = 0,
    one = 1,
    id = 2
}
```
- `all`: Search all documents.
- `one`: Search for a single document.
- `id`: Search by document ID.

## License

This project is licensed under the MIT License.