const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//define paths
const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Cat'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Cat'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is an example help message',
        title: 'Help',
        name: 'Cat'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, {latitude, longtitude, location} = {}) => { //if it has an error, default value will be {}
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longtitude, (error, { description, temperature, feelslike } = {}) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                location,
                forecast: description,
                temperature,
                feelslike                
            })
        })
})
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: 'Error',
        name: 'Cat'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found.',
        title: 'Error 404',
        name: 'Cat'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})