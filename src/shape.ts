import mongoose, { Document, Model, UpdateWriteOpResult } from "mongoose";
import { Query, QueryU, QueryUpdate, TOSN, TOSU, Uptions } from "./interfaces/ShapeFunctions";
import { DBError } from "./utils/Error";
import { createNestedObject } from "./utils/NestedObject";
class Shape {
    constructor(name: string, ModelData: Model<any>) {
        this.name = name
        this.model = ModelData

    }

    public name: string;
    public model: Model<any>

    public async searchWI(options: Query): Promise<Document<unknown, any, unknown> | Document<unknown, any, unknown>[] | undefined | null> {
        const { type = TOSN.one, key, value } = options
        if (!type || !value) {
            const ErrorData = new DBError("Invaild param was provided")
            throw new Error(ErrorData.message)
        }

        if (type == TOSN.id) {
            return await this.model.findById(value)
        }

        else if (type == TOSN.one) {
            if (!key) {
                const ErrorData = new DBError("Invaild param was provided")
                throw new Error(ErrorData.message)
            }

            return await this.model.findOne({ [key]: value })
        }

        else if (type == TOSN.all) {
            const QueryData = key && value ? { [key]: value } : {}
            return await this.model.find(QueryData)

        }

        else {
            const ErrorData = new DBError("Bad Type was provided")
            throw new Error(ErrorData.message)
        }


    }


    public async editWI(
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
    > {
        const { key, value } = filter;
        if (!key || !value || typeof key !== "string") {
            const ErrorData = new DBError('Invalid param was provided "filter"');
            throw new Error(ErrorData.message);
        }

        try {
      
        if (type === TOSU.one) {
            if ("key" in update && "value" in update) {
                const Ukey = update.key as string;
                const arrOfD = Ukey.split(".");
                const QueryData = createNestedObject(
                    arrOfD,
                    update.value,
                    options?.arrayMethod ? options.arrayMethod : undefined
                );
                const UpdateOption = { new: true, upsert: options?.createNew ? true : false };
                return await this.model.findOneAndUpdate(filter, QueryData, UpdateOption);
            } else if (typeof update === "object" && !Array.isArray(update)) {
                const UpdateOption = { new: true, upsert: options?.createNew ? true : false };
                return await this.model.findOneAndUpdate(filter, update, UpdateOption);
            } else {
                const ErrorData = new DBError('Invalid param was provided "update"');
                throw new Error(ErrorData.message);
            }
        } else if (type === TOSU.all) {
            if ("key" in update && "value" in update) {
                const Ukey = update.key as string;
                const arrOfD = Ukey.split(".");
                const QueryData = createNestedObject(
                    arrOfD,
                    update.value,
                    options?.arrayMethod ? options.arrayMethod : undefined
                );
                const UpdateOption = { new: true, upsert: options?.createNew ? true : false };
                return await this.model.updateMany(filter, QueryData, UpdateOption); // updateMany result is handled
            } else if (typeof update === "object" && !Array.isArray(update)) {
                const UpdateOption = { new: true, upsert: options?.createNew ? true : false };
                return await this.model.updateMany(filter, update, UpdateOption); // updateMany result is handled
            } else {
                const ErrorData = new DBError('Invalid param was provided "update"');
                throw new Error(ErrorData.message);
            }
        } else {
            const ErrorData = new DBError('Invalid param was provided "type"');
            throw new Error(ErrorData.message);
        }


              
    } catch (error: any) {
        const ErrorData = new DBError(error.message);
        throw new Error(ErrorData.message);  
    }

    }
    







}

export { Shape }