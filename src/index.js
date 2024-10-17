import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ejs from 'ejs'
import { respuesta, respuestaError } from './helpers/tools.js'
import { print } from './controllers/Print.js'
import rutas from './routes/index.routes.js'
import cors from 'cors'

/*const express = require('express')
const path = require('path')
const ejs = require('ejs')
const cors = require('cors')*/


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

//configuraciones
app.set('port', process.env.PORT || 3200)
app.set('views', path.join(__dirname, 'views'))
app.engine('html', ejs.renderFile)
app.set('view engine', 'ejs')

// middleware
//app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + "/public")));
app.use(cors())

// rutas
app.use(rutas)
//app.use(require('./routes/index.routes'))

// Manejador de errores no controlados
process.on('uncaughtException', (error) => {
    console.error('Exception no controladas:', error);
    // Aquí puedes registrar el error o enviar una notificación
});

// Manejador de rechazo de promesas no controladas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Puedes registrar el error o tomar otra acción
});

app.listen(app.get('port'), () => {
    console.log('servidor conectado al puerto ', app.get('port'))
})
