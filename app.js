const express = require("express");
const config = require("./config.js");
const path = require('path');
const app = express();
const routerUser = require("./routes/users.js");
const routerBook = require("./routes/books.js");
// json to object
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));  

app.use("/user", routerUser);
app.use("/book", routerBook);

app.listen(config.PORT, () => {
  console.log(`Application started on http://localhost:${config.PORT}`);
});
