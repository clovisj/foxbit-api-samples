import WebSocket from 'ws';
import * as crypto from "crypto";

import * as dotenv from "dotenv";
dotenv.config()

const {
    WS_URL
    , KEY
    , SECRET
    , UID
} = process.env;

class WSService {
    private ws: WebSocket
    private connected: boolean
    private authenticated: boolean
    private lastMsg: number
    private lastSend: number
    private msg: any
    user?: any
    constructor() {
        this.connected = false
        this.authenticated = false
        this.lastMsg = 0
        this.lastSend = 0
        this.ws = new WebSocket(`${WS_URL}`)

        this.ws.on('open', () => {
            this.connected = true
            this.onOpen()
        })
        this.ws.on('close', () => {
            this.connected = false
            this.authenticated = false
            this.onClose()
        })

        //Event Receiving Message
        this.ws.on('message', (data) => {
            this.onMessage(data)
        })

        //Event Error Message
        this.ws.on('error', err => console.error)
    }

    private async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    private async waitReceive() {
        while (this.lastSend >= this.lastMsg) {
            await this.delay(100);
        }
    }

    private async onOpen() {
        console.log('WS-connected');
        // this.authManual('test@gmail.com', '123');
        // this.auth2FA('567502')
        await this.auth();
    }

    private onClose() {
        console.log('WS-disconnected');
    }

    private onMessage(data: any) {
        this.lastMsg = Date.now()
        const { o, n } = JSON.parse(data);
        const res = JSON.parse(o);
        this.msg = res;
        // console.log('WS-message: %j', res);
        console.log('WS-message: ', JSON.stringify(res, null, 4))

        switch (n) {
            case 'WebAuthenticateUser':
            case 'AuthenticateUser':
                this.authenticated = res.Authenticated === true
                console.log('WS-authenticated: %j', this.authenticated)
                if (this.authenticated) {
                    this.user = res.User
                }
                break;
        }
    }
    public async send(request: any, wait: boolean = true) {
        console.log(`WS-send: ${request.n}`);

        switch (request.n) {
            case 'Authenticate2FA':
                if (!this.authenticated) {
                    console.error('auth not authenticated yet!');
                    return;
                }
        }

        if (typeof (request.o) === 'object') {
            request.o = JSON.stringify(request.o)
        }

        this.ws.send(JSON.stringify(request))
        this.lastSend = Date.now()

        if (wait) {
            await this.waitReceive()
            return this.msg
        }
    }
    private async auth() {
        const nonce = Date.now();
        const hash = crypto.createHmac('sha256', `${SECRET}`)
            .update(nonce + `${UID}` + KEY)
            .digest('hex')

        const payload = {
            APIKey: KEY,
            Signature: hash,
            UserId: UID,
            Nonce: nonce
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "AuthenticateUser",
            o: JSON.stringify(payload)

        }

        await this.send(request)
    }
}

export default new WSService();