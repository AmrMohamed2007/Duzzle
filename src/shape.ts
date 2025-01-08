import { Document, Model, UpdateWriteOpResult } from "mongoose";
import { Query, QueryU, QueryUpdate, TOSN, TOSU, Uptions } from "./interfaces/ShapeFunctions";
import { DBError } from "./utils/Error";
import { createNestedObject } from "./utils/NestedObject";
import { EventEmitter } from "events";
import { DatabaseOptions } from "./interfaces/Database";
import { autoHash, compareHash } from "./utils/Hash";

export class Shape extends EventEmitter {
    constructor(name: string, ModelData: Model<any>, extentions?: DatabaseOptions) {
        super()
        this.name = name
        this.model = ModelData
        this.extentions = extentions ? extentions : undefined

    }

    public name: string;
    public model: Model<any>
    public extentions?: DatabaseOptions
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
            console.log(key, value);

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
        var Nfilter = { [key as string]: value }

        try {

            if (type === TOSU.one) {

                if ("key" in update && "value" in update) {
                    const Ukey = update.key as string;
                    const arrOfD = Ukey.split(".");
                    console.log(this.extentions?.autoHash?.enable, await autoHash(this?.extentions, [{ [update.key as string]: update.value }]));

                    const val: any = this.extentions?.autoHash?.enable ? await autoHash(this.extentions, [{ [update.key as string]: update.value }]) : [{ [update.key as string]: update.value }]
                    const QueryData = await createNestedObject(
                        arrOfD,
                        val[0][update.key as string],
                        options?.arrayMethod ? options.arrayMethod : undefined
                    );

                    const UpdateOption = { new: true, upsert: options?.createNew ? true : false, strict: false };
                    console.log(UpdateOption, QueryData, "asd");

                    const foau = await this.model.findOneAndUpdate(Nfilter, QueryData, UpdateOption);
                    this.emit("dbEdited", { data: foau, type: TOSU.one });
                    return foau;
                } else if (typeof update === "object" && !Array.isArray(update)) {
                    const UpdateOption = { new: true, upsert: options?.createNew ? true : false, strict: false };
                    const val: any = this.extentions?.autoHash?.enable ? await autoHash(this.extentions, [update]) : [update]
                    console.log(UpdateOption, val, 'asdي');
                    const foau = await this.model.findOneAndUpdate(Nfilter, val[0], UpdateOption);
                    this.emit("dbEdited", { data: foau, type: TOSU.one });
                    return foau;
                } else {
                    const ErrorData = new DBError('Invalid param was provided "update"');
                    throw new Error(ErrorData.message);
                }
            } else if (type === TOSU.all) {
                if ("key" in update && "value" in update) {
                    const Ukey = update.key as string;
                    const arrOfD = Ukey.split(".");
                    const val: any = this.extentions?.autoHash?.enable ? await autoHash(this.extentions, [{ [update.key as string]: update.value }]) : [{ [update.key as string]: update.value }]
                    const QueryData = createNestedObject(
                        arrOfD,
                        val[0][update.key as string],
                        options?.arrayMethod ? options.arrayMethod : undefined
                    );
                    const UpdateOption = { new: true, upsert: options?.createNew ? true : false, strict: false };
                    this.emit("dbEdited", { type: TOSU.all });
                    return await this.model.updateMany(filter, QueryData, UpdateOption); // updateMany result is handled
                } else if (typeof update === "object" && !Array.isArray(update)) {
                    const val: any = this.extentions?.autoHash?.enable ? await autoHash(this.extentions, [update]) : [update]
                    const UpdateOption = { new: true, upsert: options?.createNew ? true : false, strict: false };
                    this.emit("dbEdited", { type: TOSU.all });
                    return await this.model.updateMany(filter, val[0], UpdateOption); // updateMany result is handled
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

    public async compareHash(hashedPassword: string, password: string): Promise<boolean> {
        return await compareHash(password, hashedPassword)
    }








}

