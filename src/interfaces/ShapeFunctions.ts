// Interfaces
interface Query {
    key?: string;
    value: any;
    type: TOSN;

}

interface QueryU {
    key?: string;
    value: any;
}

interface QueryUpdate {
    key: string;
    value: any;
}

interface Uptions {
    createNew?: boolean,
    arrayMethod?: "push" | 'pop' | "set"

}




// Enums
enum TOSU {
    all = 0,
    one = 1
}


enum TOSN {
    all = 0,
    one = 1,
    id = 2
}

export {
    Query,
    QueryU,
    QueryUpdate,
    Uptions,
    TOSN,
    TOSU,
}