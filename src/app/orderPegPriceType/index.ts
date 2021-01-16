// When entering a stop/trailing order, set PegPriceType to an integer that corresponds to the type of price that pegs the stop
enum OrderPegPriceType {
    Last = 1
    , Bid = 2
    , Ask = 3
    , Midpoint = 4
}

export {
    OrderPegPriceType
}