import BinanceApi, {
    Binance
    , CandleChartInterval
    , CandleChartResult
    , CandlesOptions
    , OrderBook
    , Account
    , Order
    , NewOrder
    , OrderSide,
    ExchangeInfo,
    OrderType
} from 'binance-api-node'
import * as dotenv from "dotenv"
dotenv.config()

const {
    BINANCE_KEY
    , BINANCE_SECRET
} = process.env

class BinanceWS {
    private client: Binance
    constructor() {
        // Authenticated client, can make signed calls
        this.client = BinanceApi({
            apiKey: `${BINANCE_KEY}`,
            apiSecret: `${BINANCE_SECRET}`
        })
    }

    async ping(): Promise<boolean> {
        return await this.client.ping()
    }

    async prices(symbol?: string): Promise<{ [symbol: string]: string }> {
        const payload: any = {}
        if (symbol) {
            payload.symbol = symbol
        }
        return await this.client.prices(payload)
    }

    async book(symbol: string): Promise<OrderBook> {
        return await this.client.book({ symbol })
    }

    async candles(symbol: string, interval: string, startTime?: number, endTime?: number, limit?: number): Promise<CandleChartResult[]> {
        const payload: CandlesOptions = { symbol, interval: interval as CandleChartInterval }
        if (startTime) {
            payload.startTime = startTime
        }
        if (endTime) {
            payload.endTime = endTime
        }
        if (limit) {
            payload.limit = limit
        }
        return await this.client.candles(payload)
    }

    async accountInfo(): Promise<Account> {
        return await this.client.accountInfo()
    }

    async exchangeInfo(): Promise<ExchangeInfo> {
        return await this.client.exchangeInfo()
    }

    async buy(symbol: string, type: string, quantity: number, price?: number): Promise<Order> {
        const payload: NewOrder = {
            side: 'BUY'
            , type: type as OrderType
            , symbol
            , quantity: quantity.toString()
        }
        if (price) {
            payload.price = price.toFixed(8)
        }
        return await this.client.orderTest(payload)
    }
}

const service = new BinanceWS()
export {
    service as BinanceService
}
