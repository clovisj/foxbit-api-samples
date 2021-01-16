// The period during which the order is executable.
enum OrderTimeInForce {
    Unknown = 0 // error condition
    , GTC = 1 // good ’til canceled
    , IOC = 3 // immediate or cancelled
    , FOK = 4 // fill or kill — fill the order immediately, or cancel it immediately
}

export {
    OrderTimeInForce
}