const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 6969

// Difine path for express config
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const multer = require('multer')
const { sendMessages, sendPhotos } = require('./tgBOT')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setting up static directory
app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        author: 'Yakunin Egor'
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/')
    },
    filename: function (req, file, cb) {
        let fileExt = file.originalname.split('.').pop()
        const uniqueSuffix = Date.now()
        cb(null, `img${uniqueSuffix}.${fileExt}`)
    }
})

const upload = multer({
    storage: storage
})

app.post('/send', upload.array('upload', 10), (req, res) => {
    finalMsg = `Название: <b>${req.body.text1}</b> \n\nТелефон: ${req.body.text2} \n\nИмя: ${req.body.text3} \n\nemail: ${req.body.text4}`
    sendMessages(finalMsg, req.body.text2)
    sendPhotos(req.files)
    res.render('index')
})

app.get('*', (req, res) => {
    res.render('pageNotFound', {
        title: 'Page Not Found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
