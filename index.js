const express = require('express');
require('dotenv').config()

const app = express();
const port = process.env.PORT;

const routeClient = require("./routes/client/index.route")

app.set('views', './views') //Tìm đến thư mục views
app.set('view engine', 'pug') // đọc template engine

routeClient.index(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})