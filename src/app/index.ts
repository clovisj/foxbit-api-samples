import WebSocket from 'ws';
import * as crypto from "crypto";

import * as dotenv from "dotenv";
dotenv.config();

import OrderType from './orderType'
import OrderSide from './orderSide'
import OrderPegPriceType from './orderPegPriceType';
import OrderTimeInForce from './orderTimeInForce';
import Instrument from './instrument';
import Product from './product';

const {
    WS_URL
    , KEY
    , SECRET
    , UID
} = process.env;

class App {
    private ws: WebSocket
    private connected: boolean
    private authenticated: boolean
    private user?: any
    private lastMsg: number
    private lastSend: number
    msg: any;
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
        this.auth();
        await this.waitReceive()
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
        console.log('WS-message: ', JSON.stringify(res, null, 4));

        switch (n) {
            case 'WebAuthenticateUser':
            case 'AuthenticateUser':
                this.authenticated = res.Authenticated === true
                console.log('WS-authenticated: %j', this.authenticated);
                if (this.authenticated) {
                    this.user = res.User
                }
                break;
        }
    }
    private send(request: any) {
        console.log(`WS-send: ${request.n}`);

        switch (request.n) {
            case 'Authenticate2FA':
                if (!this.authenticated) {
                    console.error('auth not authenticated yet!');
                    return;
                }
        }
        this.ws.send(JSON.stringify(request));
        this.lastSend = Date.now();
    }
    private auth() {
        const nonce = Date.now();
        const hash = crypto.createHmac('sha256', `${SECRET}`)
            .update(nonce + `${UID}` + KEY)
            .digest('hex');

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

        };

        this.send(request);
    }
    private authManual(uid: string, pwd: string) {
        const payload = {
            UserName: uid,
            Password: pwd
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "WebAuthenticateUser",
            o: JSON.stringify(payload)

        };

        this.send(request);
    }
    private auth2FA(code: string) {
        const payload = {
            Code: code
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "Authenticate2FA",
            o: JSON.stringify(payload)

        };

        this.send(request);
    }
    async getProducts() {
        const {
            OMSId
        } = this.user

        const payload = {
            OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetProducts",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg;
    }
    async getInstruments() {
        const {
            OMSId
        } = this.user

        const payload = {
            OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetInstruments",
            o: JSON.stringify(payload)
        }

        this.send(request);
        await this.waitReceive()
        return this.msg
    }
    async getUserInfo() {
        const payload = {
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetUserInfo",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getOpenOrders() {
        const {
            AccountId
            , OMSId
        } = this.user

        const payload = {
            AccountId
            , OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetOpenOrders",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getOrderHistory() {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetOrderHistory",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getOrderFee(instrumentId: Instrument, productId: Product, amount: number, price: number) {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , InstrumentId: instrumentId
            , ProductId: productId
            , Amount: amount
            , Price: price
            , OrderType: OrderType.Market
            // , MakerTaker: "Unknown" //Unknown,Maker,Taker
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetOrderFee",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async sendOrder(instrumentId: Instrument, quantity: number, price: number, type:OrderType, side: OrderSide = OrderSide.Buy) {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            // , ClientOrderId: 0 // 
            , Quantity: quantity
            , DisplayQuantity: 0
            , UseDisplayQuantity: false
            , LimitPrice: price
            , OrderIdOCO: 0
            , OrderType: type
            , PegPriceType: OrderPegPriceType.Last
            , InstrumentId: instrumentId
            , TrailingAmount: 1.0
            , LimitOffset: 2.0
            , Side: side
            , StopPrice: price
            , TimeInForce: OrderTimeInForce.GTC
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "SendOrder",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getOrderStatus(id: number) {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , OrderId: id
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetOrderStatus",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async cancelOrder(id: number) {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , OrderId: id
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "CancelOrder",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getL2Snapshot() {
        const payload = {
            "OMSId": 1,
            "InstrumentId": 1,
            "Depth": 2
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetL2Snapshot",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    getAvailablePermissionList() {
        const payload = {
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAvailablePermissionList",
            o: JSON.stringify(payload)
        }

        this.send(request);
    }
    async subscribeLevel1(instrument: Instrument) {
        const payload = {
            "OMSId": 1,
            "InstrumentId": instrument
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "SubscribeLevel1",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        const msg = this.msg
        this.unsubscribeLevel1(instrument)
        return msg
    }
    unsubscribeLevel1(instrument: Instrument) {
        const payload = {
            "OMSId": 1,
            "InstrumentId": instrument
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "UnsubscribeLevel1",
            o: JSON.stringify(payload)
        }

        this.send(request)
    }
    async getAccountPositions() {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAccountPositions",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getAccountTrades() {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , StartIndex: 0
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAccountTrades",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getAccountFees() {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , StartIndex: 0
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAccountFees",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getDepositInfo(productId: Product, generateNewKey: boolean = false) {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , ProductId: productId
            , GenerateNewKey: generateNewKey
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetDepositInfo",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getAllDepositRequestInfoTemplates(productId: Product) {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , ProductId: productId
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAllDepositRequestInfoTemplates",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }
    async getAllDepositTickets() {
        const {
            AccountId
            , OMSId
        } = this.user;

        const payload = {
            AccountId
            , OMSId
            , StartIndex: 0
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAllDepositTickets",
            o: JSON.stringify(payload)
        }

        this.send(request)
        await this.waitReceive()
        return this.msg
    }

    main() {
        console.log(123)
        return null;
    }
}

export default new App();