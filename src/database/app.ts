import { EventEmitter } from 'events';
import { connect } from '../app/connect';
import mongoose, { Model } from "mongoose"
import { DBError } from '../utils/Error';
import { ShapeAdd } from '../../index';
import { createSch } from '../app/Schema/create';
import { Shape } from './Shape/shape';
import { color } from '../utils/Colors';
import { DatabaseOptions } from '../../index';

export class App extends EventEmitter {
    /**
     * Creates an instance of the App class, which is an EventEmitter.
     *
     * @param {string} url - The url of the MongoDB database.
     * @param {DatabaseOptions} [extentions] - The options for the Mongoose connection.
     */
    constructor(url: string, extentions?: DatabaseOptions) {
        super();
        this.url = url;
        this.connected = false;
        this.db = undefined;
        this.Shapes = {}
        this.extentions = extentions ? extentions : undefined
    }

    public url: string;
    public connected: boolean;
    public db: mongoose.Mongoose | undefined;
    public Shapes: Record<string, Shape>
    public extentions?: DatabaseOptions

    private RunNotes(): void {
        console.log(color("This Package Maked by https://www.youtube.com/@amrmohm", "#2ef306"));
    }

    /**
     * Establishes a connection to the MongoDB database using Mongoose.
     * 
     * @returns {Promise<void | mongoose.Mongoose>} A promise that resolves to the Mongoose instance if the connection is successful, 
     * or rejects with a DBError if the connection fails.
     * 
     * @throws {DBError} If the connection to the database fails.
     * 
     * @emits dbConnected - Emits an event when the database connection is successfully established.
     */
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

    /**
     * Creates a new shape in the database.
     *
     * @param {ShapeAdd} options - The options for creating the shape.
     * @param {string} options.name - The name of the shape.
     * @param {Model} options.SchemaData - The schema data for the shape.
     * 
     * @returns {Promise<Shape>} A promise that resolves to the newly created shape.
     * 
     * @throws {Error} If the options, schema data, or name are not provided.
     * @throws {Error} If the name is not a string or the schema data is not an instance of Model.
     * @throws {Error} If the database is not connected.
     */
    
    public async createShape(options: ShapeAdd): Promise<Shape> {

        if (!options || !options.SchemaData || !options.name) {
            const ErrorData = new DBError("Error name or schema data not provided");
            throw new Error(ErrorData.message);
        }

        if (typeof options.name !== "string" || options.SchemaData! instanceof Model) {
            const ErrorData = new DBError("Error name or schema data true type does not provided");
            throw new Error(ErrorData.message);
        }

        if (!this.connected) {
            const ErrorData = new DBError("db is not connected to make a shape");
            throw new Error(ErrorData.message);
        }

        const Schema = await createSch({ name: options.name, data: options.SchemaData }) as Model<any>
        const newShape: Shape = new Shape(options.name, Schema, this.extentions)
        this.Shapes[options.name] = newShape;

        return newShape as Shape;
    }




}



