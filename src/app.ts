import { EventEmitter } from 'events';
import { connect } from './app/connect';
import mongoose, { Model } from "mongoose"
import { DBError } from './utils/Error';
import { ShapeAdd } from './interfaces/Shape';
import { createSch } from './app/Schema/create';
import { Shape } from './shape';
import { color } from './utils/Colors';
import { DatabaseOptions } from './interfaces/Database';

export class App extends EventEmitter {
    constructor(url: string, options?: DatabaseOptions) {
        super();
        this.url = url;
        this.connected = false;
        this.db = undefined;
        this.Shapes = {}
        this.options = options ? options : undefined
    }

    public url: string;
    public connected: boolean;
    public db: mongoose.Mongoose | undefined;
    public Shapes: Record<string, Shape>
    public options?: DatabaseOptions

    private RunNotes(): void {
        console.log(color("This Package Maked by https://www.youtube.com/@amrmohm", "#2ef306")); 
    }

    public async connect(): Promise<void | mongoose.Mongoose> {
        this.RunNotes();
        const Mongoose = await connect(this.url);
        if (!Mongoose || typeof Mongoose == "boolean") {
            return Promise.reject(new DBError("Mongoose is not connected"))

        }
        this.db = Mongoose;
        this.connected = true;
        this.emit("dbConnected", { url: this.url, db: Mongoose })
        return Promise.resolve(Mongoose)
    }

    public disconnect(): Promise<void> {
        if (this.connected) {
            this.db?.disconnect()
            this.connected = false
            return Promise.resolve()
        }
        return Promise.reject(new DBError("Mongoose is not connected"))
    }

    public async createShape(options: ShapeAdd): Promise<Model<any>> {

        if (!options || !options.SchemaData || !options.name) {
            const ErrorData = new DBError("Error name or schema data not provided");
            throw new Error(ErrorData.message);
        }

        if (typeof options.name !== "string" || options.SchemaData! instanceof Model) {
            const ErrorData = new DBError("Error name or schema data true type does not provided");
            throw new Error(ErrorData.message);
        }

        const Schema = await createSch({ name: options.name, data: options.SchemaData })
        const newShape = new Shape(options.name, Schema)
        this.Shapes[options.name] = newShape;

        return Schema;
    }




}


