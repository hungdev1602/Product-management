const express = require('express')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config()

const app = express();
const port = process.env.PORT;

// nhúng thư viện express-flash để hiện thỉ thông báo
app.use(cookieParser('NDHLTBH'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// parse application/json của thư viện body-parser
app.use(bodyParser.json())

const systemConfig = require('./config/system')

// Connect database
const database = require("./config/database")
database.connect()

const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")

app.set('views', './views') //Tìm đến thư mục views
app.set('view engine', 'pug') // đọc template engine

app.use(express.static('public')) // Thiết lập thư mục chứa file tĩnh

// Khai báo biến toàn cục cho file PUG
app.locals.prefixAdmin = systemConfig.prefixAdmin

// Khai báo các route (đường dẫn)
routeAdmin.index(app)
routeClient.index(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})