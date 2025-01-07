import mongoose, { Document, Model, UpdateWriteOpResult } from "mongoose";

import { EventEmitter } from 'events';
import { Query, QueryU, QueryUpdate, TOSU, Uptions } from "./interfaces/ShapeFunctions";

declare class Shape extends EventEmitter {
    constructor (name: string, ModelData: Model<any>);
      public name: string;
      public model: Model<any>
      public searchWI(options: Query): Promise<Document<unknown, any, unknown> | Document<unknown, any, unknown>[] | undefined | null>;
      public editWI(
        filter: QueryU,
        update: QueryUpdate | Record<string, unknown>,
        type: TOSU,
        options?: Uptions
    ): Promise<
        | Document<unknown, any, unknown>
        | Document<unknown, any, unknown>[]
        | UpdateWriteOpResult
        | undefined
        | null
    >;
    public compareHash(hashedPassword: string, password: string): Promise<boolean>

    
}

export = Shape