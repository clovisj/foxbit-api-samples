import WS from '../ws'
import Instrument from './id';

class InstrumentService {
    async list() {
        const {
            OMSId
        } = WS.user

        const payload = {
            OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetInstruments",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async status(id: Instrument) {
        const res = await this.subscribeLevel1(id)
        this.unsubscribeLevel1(id)
        return res
    }
    private async subscribeLevel1(id: Instrument) {
        const payload = {
            "OMSId": 1,
            "InstrumentId": id
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "SubscribeLevel1",
            o: payload
        }

        const res = await WS.send(request)
        this.unsubscribeLevel1(id)
        return res
    }
    private unsubscribeLevel1(id: Instrument) {
        const payload = {
            "OMSId": 1,
            "InstrumentId": id
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "UnsubscribeLevel1",
            o: payload
        }

        WS.send(request, false)
    }
}

export {
    Instrument
}

export default new InstrumentService()