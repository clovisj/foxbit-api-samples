import WS from '../ws'
import Product from './id';

class ProductService {
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
            n: "GetProducts",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
}

export {
    Product
}

export default new ProductService()