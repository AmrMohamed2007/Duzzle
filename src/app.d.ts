import { EventEmitter } from 'events';
import {Model, Mongoose} from "mongoose"
import {ShapeAdd} from "./interfaces/Shape"

declare class App extends EventEmitter {
    constructor (url: string);
    public url: string;
    public connected: boolean;
    public db: Mongoose | undefined;
    public Schemas: Record<string, Model<any>>
    public RunNotes(): void;
    public connect(): Promise<void | Mongoose>;
    public disconnect(): Promise<void>
    public createShape(options: ShapeAdd): Promise<Model<any>>

}

export = App