import express from 'express'
import OrderService from '../app/order'
import AccountService from '../app/account'
import DepositService from '../app/deposit'
import InstrumentService from '../app/instrument'
import UserService from '../app/user'
import ProductService from '../app/product'
import { BinanceService } from '../binance'


const api = express()
api.use(express.json()) // allow receive json body

api.get("/", (req, res) => {
    res.status(200).json({ uptime: process.uptime() })
})
api.get("/user", async (req, res) => {
    const data = await UserService.info()
    res.status(200).json(data)
})
api.get("/user/permissions", async (req, res) => {
    const data = await UserService.permissions()
    res.status(200).json(data)
})
api.get("/product", async (req, res) => {
    const data = await ProductService.list()
    res.status(200).json(data)
})
api.get("/instrument", async (req, res) => {
    const data = await InstrumentService.list()
    res.status(200).json(data)
})
api.get("/instrument/:id", async (req, res) => {
    const data = await InstrumentService.status(+req.params.id)
    res.status(200).json(data)
})
api.get("/order/open", async (req, res) => {
    const data = await OrderService.listOpen()
    res.status(200).json(data)
})
api.get("/order/history", async (req, res) => {
    const data = await OrderService.listHistory()
    res.status(200).json(data)
})
api.get("/order/fee/:instrument/:product", async (req, res) => {
    const data = await OrderService.fee(+req.params.instrument, +req.params.product, +(req.query.amount || 0), +(req.query.price || 0))
    res.status(200).json(data)
})
api.get("/order/:id", async (req, res) => {
    const data = await OrderService.status(+req.params.id)
    res.status(200).json(data)
})
api.post("/order/:instrument", async (req, res) => {
    const { quantity, price, type } = req.body
    const data = await OrderService.send(+req.params.instrument, quantity, price, type)
    res.status(200).json(data)
})
api.delete("/order/:id", async (req, res) => {
    const data = await OrderService.cancel(+req.params.id)
    res.status(200).json(data)
})
api.get("/account/positions", async (req, res) => {
    const data = await AccountService.positions()
    res.status(200).json(data)
})
api.get("/account/trades", async (req, res) => {
    const data = await AccountService.trades()
    res.status(200).json(data)
})
api.get("/account/fees", async (req, res) => {
    const data = await AccountService.fees()
    res.status(200).json(data)
})
api.get("/deposit", async (req, res) => {
    const data = await DepositService.tickets()
    res.status(200).json(data)
})
api.get("/deposit/:product/info", async (req, res) => {
    const data = await DepositService.infoByProduct(+req.params.product)
    res.status(200).json(data)
})
api.get("/deposit/:product/template", async (req, res) => {
    const data = await DepositService.templatesByProduct(+req.params.product)
    res.status(200).json(data)
})
api.get("/binance", async (req, res) => {
    const data = await BinanceService.ping()
    res.status(200).json(data)
})
api.get("/binance/prices", async (req, res) => {
    const data = await BinanceService.prices()
    res.status(200).json(data)
})
api.get("/binance/account", async (req, res) => {
    const data = await BinanceService.accountInfo()
    res.status(200).json(data)
})
api.get("/binance/info", async (req, res) => {
    const data = await BinanceService.exchangeInfo()
    res.status(200).json(data)
})
api.get("/binance/:symbol/prices", async (req, res) => {
    const data = await BinanceService.prices(req.params.symbol)
    res.status(200).json(data)
})
api.get("/binance/:symbol/book", async (req, res) => {
    const data = await BinanceService.book(req.params.symbol)
    res.status(200).json(data)
})
api.get("/binance/:symbol/candles/:interval", async (req, res) => {
    const startTime = req.query.startTime ? +req.query.startTime : undefined
    const endTime = req.query.endTime ? +req.query.endTime : undefined
    const limit = req.query.limit ? +req.query.limit : undefined
    const data = await BinanceService.candles(req.params.symbol, req.params.interval, startTime, endTime, limit)
    res.status(200).json(data)
})
api.post("/binance/:symbol/buy", async (req, res) => {
    const { quantity, price, type } = req.body
    try {
        const data = await BinanceService.buy(req.params.symbol, type, quantity, price)
        res.status(200).json(data)
    }
    catch (err) {
        console.error(err)
        res.status(400).json(err)
    }
})

api.listen(3000, () => {
    console.log("Running at http://localhost:3000")
})