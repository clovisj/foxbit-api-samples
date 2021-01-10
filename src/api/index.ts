import express from 'express'
import App from '../app'


const api = express();
api.use(express.json()); // allow receive json body

api.get("/", (req, res) => {
    res.status(200).json({ uptime: process.uptime() });
});
api.get("/user", async (req, res) => {
    const data = await App.getUserInfo();
    res.status(200).json(data);
});
api.get("/product", async (req, res) => {
    const data = await App.getProducts();
    res.status(200).json(data);
});
api.get("/instrument", async (req, res) => {
    const data = await App.getInstruments();
    res.status(200).json(data);
});
api.get("/instrument/:id", async (req, res) => {
    const data = await App.subscribeLevel1(+req.params.id);
    res.status(200).json(data);
});
api.get("/order/open", async (req, res) => {
    const data = await App.getOpenOrders();
    res.status(200).json(data);
});
api.get("/order/history", async (req, res) => {
    const data = await App.getOrderHistory();
    res.status(200).json(data);
});
api.get("/order/fee/:instrument/:product", async (req, res) => {
    const data = await App.getOrderFee(+req.params.instrument, +req.params.product, +(req.query.amount || 0), +(req.query.price || 0));
    res.status(200).json(data);
});
api.post("/order/:instrument", async (req, res) => {
    const { amount } = req.body
    const data = await App.sendOrder(+req.params.instrument, amount);
    res.status(200).json(data);
});
api.get("/account/positions", async (req, res) => {
    const data = await App.getAccountPositions();
    res.status(200).json(data);
});
api.get("/account/trades", async (req, res) => {
    const data = await App.getAccountTrades();
    res.status(200).json(data);
});
api.get("/account/fees", async (req, res) => {
    const data = await App.getAccountFees();
    res.status(200).json(data);
});
api.get("/deposit", async (req, res) => {
    const data = await App.getAllDepositTickets();
    res.status(200).json(data);
});
api.get("/deposit/:product/info", async (req, res) => {
    const data = await App.getDepositInfo(+req.params.product);
    res.status(200).json(data);
});
api.get("/deposit/:product/template", async (req, res) => {
    const data = await App.getAllDepositRequestInfoTemplates(+req.params.product);
    res.status(200).json(data);
});

api.listen(3000, () => {
    console.log("Running at http://localhost:3000");
});