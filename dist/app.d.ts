import { EventEmitter } from 'events';
import {Model, Mongoose} from "mongoose"
import {ShapeAdd} from "./interfaces/Shape"
import {Shape} from "./shape"
import { DatabaseOptions } from './interfaces/Database';
export class App extends EventEmitter {
    constructor (url: string, extentions: DatabaseOptions);
    public url: string;
    public connected: boolean;
    public db: Mongoose | undefined;
    public extentions?: DatabaseOptions
    public Shapes: Record<string, Shape>
    public RunNotes(): void;
    public connect(): Promise<void | Mongoose>;
    public disconnect(): Promise<void>
    public createShape(options: ShapeAdd): Promise<Shape>

}
