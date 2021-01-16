import WS from '../ws'
import { OrderType } from '../orderType'
import { OrderSide } from '../orderSide'
import { OrderPegPriceType } from '../orderPegPriceType'
import { OrderTimeInForce } from '../orderTimeInForce'
import { Instrument } from '../instrument'
import { Product } from '../product'

class OrderService {
    async listOpen() {
        const {
            AccountId
            , OMSId
        } = WS.user

        const payload = {
            AccountId
            , OMSId
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetOpenOrders",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async listHistory() {
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
            n: "GetOrderHistory",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async fee(instrumentId: Instrument, productId: Product, amount: number, price: number) {
        const {
            AccountId
            , OMSId
        } = WS.user;

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
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async send(instrumentId: Instrument, quantity: number, price: number, type: OrderType, side: OrderSide = OrderSide.Buy) {
        const {
            AccountId
            , OMSId
        } = WS.user;

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
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async status(id: number) {
        const {
            AccountId
            , OMSId
        } = WS.user;

        const payload = {
            AccountId
            , OMSId
            , OrderId: id
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetOrderStatus",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async cancel(id: number) {
        const {
            AccountId
            , OMSId
        } = WS.user;

        const payload = {
            AccountId
            , OMSId
            , OrderId: id
        }

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "CancelOrder",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
}

export default new OrderService()