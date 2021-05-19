import BinanceApi, { Binance, CandleChartInterval, CandleChartResult, CandlesOptions, OrderBook } from 'binance-api-node'
import * as dotenv from "dotenv"
dotenv.config()

const {
    BINANCE_KEY
    , BINANACE_SECRET
} = process.env

class BinanceWS {
    private client: Binance
    constructor() {
        // Authenticated client, can make signed calls
        this.client = BinanceApi({
            apiKey: `${BINANCE_KEY}`,
            apiSecret: `${BINANACE_SECRET}`,
            // getTime: xxx,
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

    async candles(symbol: string, interval: string, startTime?: number, endTime?: number): Promise<CandleChartResult[]> {
        const payload: CandlesOptions = { symbol, interval: interval as CandleChartInterval }
        if (startTime) {
            payload.startTime = startTime
        }
        if (endTime) {
            payload.endTime = endTime
        }
        return await this.client.candles(payload)
    }
}

const service = new BinanceWS()
export {
    service as BinanceService
}
