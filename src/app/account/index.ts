import WS from '../ws'

class AccountService {
    async positions() {
        const {
            AccountId
            , OMSId
        } = WS.user;

        const payload = {
            AccountId
            , OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAccountPositions",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async trades() {
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
            n: "GetAccountTrades",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async fees() {
        const {
            AccountId
            , OMSId
        } = WS.user

        const payload = {
            AccountId
            , OMSId
            , StartIndex: 0
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAccountFees",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
}

export default new AccountService()