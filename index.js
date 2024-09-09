const express = require('express');

const app = express();
const port = 3000;

const routeClient = require("./routes/client/index.route")

app.set('views', './views') //Tìm đến thư mục views
app.set('view engine', 'pug') // đọc template engine

routeClient.index(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})