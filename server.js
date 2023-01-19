const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const addressRoute = require("./routes/address");
const categoryRoute = require("./routes/category");
const newsletterRoute = require("./routes/newsletter");
const contactRoute = require("./routes/contact");
const paymentRoute = require("./routes/payment");

dotenv.config();
const app = express();
const session = require("express-session");
app.use(
  session({
    key: "userid",
    secret: "subscribe",
    resave: false,
    saveUninitialized: true,
    save: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

//mongoose;
mongoose
.connect(process.env.MONGO_URL, { useNewUrlParser: true })
.then(() => {
  console.log("db connected successfully");
})
.catch((err) => {
  console.log(err);
});

//middleware;
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/alphaapi/auth", authRoute);
app.use("/alphaapi/pay", paymentRoute);
app.use("/alphaapi/users", userRoute);
app.use("/alphaapi/product", productRoute);
app.use("/alphaapi/category", categoryRoute);
app.use("/alphaapi/newsletter", newsletterRoute);
app.use("/alphaapi/contact", contactRoute);
app.use("/alphaapi/cart", cartRoute);
app.use("/alphaapi/order", orderRoute);
app.use("/alphaapi/address", addressRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("api is runing");
});
