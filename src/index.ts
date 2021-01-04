import * as WebSocket from 'ws';
import * as dotenv from "dotenv";
dotenv.config();

class App {
    private ws: WebSocket;
    constructor() {
        const { WS_URL } = process.env;
        this.ws = new WebSocket(WS_URL);

        this.ws.on('open', () => {
            this.onOpen();
        });

        //Event Receiving Message
        this.ws.on('message', this.onMessage);

        //Event Error Message
        this.ws.on('error', err => console.error);

        //Event Close Message
        this.ws.on('close', this.onClose);
    }

    private onOpen() {
        console.log('WS-connected');
        // this.auth();
        this.getProducts()
    }

    private onClose() {
        console.log('WS-disconnected');
    }

    private onMessage(data: any) {
        const { o } = JSON.parse(data);
        const res = JSON.parse(o);
        console.log('WS-message: %j', res);
    }
    private auth() {
        const frame = {

            "m": 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            "i": 0,		//Sequence Number
            "n": "",		//Function Name
            "o": ""		//Payload

        };
        frame.n = "WebAuthenticateUser";

        const { UID, PWD } = process.env;
        var requestPayload = { "UserName": UID, "Password": PWD };

        frame.o = JSON.stringify(requestPayload);

        this.ws.send(JSON.stringify(frame));
    }
    private getProducts() {
        const frame = {

            "m": 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            "i": 0,		//Sequence Number
            "n": "",		//Function Name
            "o": ""		//Payload

        };
        frame.n = "GetProducts";

        var requestPayload = {
            "OMSId": 1
        };

        frame.o = JSON.stringify(requestPayload);

        this.ws.send(JSON.stringify(frame));
    }

    main() {
        console.log(123)
        return null;
    }
}

export default new App();