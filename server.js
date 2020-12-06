const express = require("express")
const app = express()

// call router
let customer = require("./router/customer")
let product = require("./router/product")
let admin = require("./router/admin")
let auth = require("./router/auth")
let transaksi = require("./router/transaksi")

app.use("/customer", customer)
app.use("/product", product)
app.use("/admin", admin)
app.use("/auth", auth)
app.use("/transaksi", transaksi)

app.listen(8000, () => {
    console.log(`Server run on port 8000`);
})