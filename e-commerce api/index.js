const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth.js')
const productRoute = require('./routes/product.js')
const cartRoute = require('./routes/cart.js')
const orderRoute = require('./routes/order.js')

const cors = require('cors')

dotenv.config()

mongoose.connect(process.env.MONGO_URL)

app.use(cors());
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
})


