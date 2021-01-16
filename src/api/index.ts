import express from 'express'
import OrderService from '../app/order'
import AccountService from '../app/account'
import DepositService from '../app/deposit'
import InstrumentService from '../app/instrument'
import UserService from '../app/user'
import ProductService from '../app/product'


const api = express();
api.use(express.json()); // allow receive json body

api.get("/", (req, res) => {
    res.status(200).json({ uptime: process.uptime() });
});
api.get("/user", async (req, res) => {
    const data = await UserService.info();
    res.status(200).json(data);
});
api.get("/user/permissions", async (req, res) => {
    const data = await UserService.permissions();
    res.status(200).json(data);
});
api.get("/product", async (req, res) => {
    const data = await ProductService.list();
    res.status(200).json(data);
});
api.get("/instrument", async (req, res) => {
    const data = await InstrumentService.list();
    res.status(200).json(data);
});
api.get("/instrument/:id", async (req, res) => {
    const data = await InstrumentService.status(+req.params.id);
    res.status(200).json(data);
});
api.get("/order/open", async (req, res) => {
    const data = await OrderService.listOpen();
    res.status(200).json(data);
});
api.get("/order/history", async (req, res) => {
    const data = await OrderService.listHistory();
    res.status(200).json(data);
});
api.get("/order/fee/:instrument/:product", async (req, res) => {
    const data = await OrderService.fee(+req.params.instrument, +req.params.product, +(req.query.amount || 0), +(req.query.price || 0));
    res.status(200).json(data);
});
api.get("/order/:id", async (req, res) => {
    const data = await OrderService.status(+req.params.id);
    res.status(200).json(data);
});
api.post("/order/:instrument", async (req, res) => {
    const { quantity, price, type } = req.body
    const data = await OrderService.send(+req.params.instrument, quantity, price, type);
    res.status(200).json(data);
});
api.delete("/order/:id", async (req, res) => {
    const data = await OrderService.cancel(+req.params.id);
    res.status(200).json(data);
});
api.get("/account/positions", async (req, res) => {
    const data = await AccountService.positions();
    res.status(200).json(data);
});
api.get("/account/trades", async (req, res) => {
    const data = await AccountService.trades();
    res.status(200).json(data);
});
api.get("/account/fees", async (req, res) => {
    const data = await AccountService.fees();
    res.status(200).json(data);
});
api.get("/deposit", async (req, res) => {
    const data = await DepositService.tickets();
    res.status(200).json(data);
});
api.get("/deposit/:product/info", async (req, res) => {
    const data = await DepositService.infoByProduct(+req.params.product);
    res.status(200).json(data);
});
api.get("/deposit/:product/template", async (req, res) => {
    const data = await DepositService.templatesByProduct(+req.params.product);
    res.status(200).json(data);
});

api.listen(3000, () => {
    console.log("Running at http://localhost:3000");
});