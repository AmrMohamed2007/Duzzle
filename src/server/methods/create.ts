import { Application, Response, Request } from "express"
import { Method } from "../../utils/Methods"




export function method(app: Application, method: Method, path: string) {
    (app as any)[method](path, (req: Request, res: Response) => {
        
    })
}