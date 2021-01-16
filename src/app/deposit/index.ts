import WS from '../ws'
import Product from '../product/id';

class DepositService {
    async infoByProduct(productId: Product, generateNewKey: boolean = false) {
        const {
            AccountId
            , OMSId
        } = WS.user;

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
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async templatesByProduct(productId: Product) {
        const {
            AccountId
            , OMSId
        } = WS.user;

        const payload = {
            AccountId
            , OMSId
            , ProductId: productId
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAllDepositRequestInfoTemplates",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async tickets() {
        const {
            AccountId
            , OMSId
        } = WS.user;

        const payload = {
            AccountId
            , OMSId
            , StartIndex: 0
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAllDepositTickets",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
}

export default new DepositService()