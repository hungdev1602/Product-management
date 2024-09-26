const express = require('express')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path');
require('dotenv').config()

const app = express();
const port = process.env.PORT;

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// nhúng thư viện express-flash để hiện thỉ thông báo
app.use(cookieParser('NDHLTBH'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// parse application/json của thư viện body-parser
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded của thư viện body-parser dành cho form
app.use(bodyParser.urlencoded({ extended: false }))

const systemConfig = require('./config/system')

// Connect database
const database = require("./config/database")
database.connect()

const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")

app.set('views', `${__dirname}/views`) //Tìm đến thư mục views
app.set('view engine', 'pug') // đọc template engine

app.use(express.static(`${__dirname}/public`)) // Thiết lập thư mục chứa file tĩnh

// Khai báo biến toàn cục cho file PUG
app.locals.prefixAdmin = systemConfig.prefixAdmin

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Khai báo các route (đường dẫn)
routeAdmin.index(app)
routeClient.index(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})