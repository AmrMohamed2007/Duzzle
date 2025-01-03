import { EventEmitter } from 'events';
import { connect } from './app/connect';
class App extends EventEmitter {
    constructor(url: string) {
        super();
        this.url = url;
    }

    public url: string;

    private RunNotes(): void { 
        console.log('This Package Maked by https://www.youtube.com/@amrmohm');
    }

    public connect() {
        this.RunNotes();

    }

  


   

}


export = App