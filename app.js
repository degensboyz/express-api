const express = require("express");
const config = require("./config.js");
const path = require("path");
const app = express();
const { routerUser, routerProduct, routerAdminAuth, routerTransactions } = require("./routes");

const cors = require("cors");
const morgan = require("morgan");

const corsOptions = {
  origin: "*",
  credentials: true,
};



app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use("/uploads/", express.static(path.join(__dirname, "uploads")));

app.use("/user", routerUser);
app.use("/product", routerProduct);
app.use("/admin-auth", routerAdminAuth);
app.use("/transactions", routerTransactions);
// app.use("/book", routerBook);

app.listen(config.PORT, () => {
  console.log(`Application started on http://localhost:${config.PORT}`);
});
