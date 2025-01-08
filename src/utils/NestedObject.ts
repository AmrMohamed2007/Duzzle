function createNestedObject(keys: string[], value: any, arrayMethod?: "push" | "pop" | "set"): Record<string, any> {
    let result: Record<string, any> = {};
    let current = result;    
    keys.forEach((key, index) =>  {
        if (index === keys.length - 1) {
            current[key] = arrayMethod ? {[arrayMethod ? `$${arrayMethod}` : "set"]: value} : value
        } else {
            current[key] = {}; 
            current = current[key]; 
        }
    });    
    return result;
}

export {createNestedObject}