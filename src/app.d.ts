import { EventEmitter } from 'events';


declare class App extends EventEmitter {
    constructor (url: string);
    public url: string;
    public RunNotes(): void;
    public connect(): any;

}

export = App