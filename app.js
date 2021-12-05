let express = require('express')
let path = require('path')

let router = require('./router')

let app = express()

app.use(express.urlencoded({ extended: true}))
app.use('/public/', express.static(path.join(__dirname, './public')))
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views'))
//事实上

app.use(router)

app.listen(7002)