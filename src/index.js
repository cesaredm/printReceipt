import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ejs from 'ejs'
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder'
import NetworkReceiptPrinter from '@point-of-sale/network-receipt-printer'
import { respuesta, respuestaError } from './helpers/tools.js'
import { print } from './controllers/Print.js'

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

app.get('/', (req, res) => {
    return res.render('index.html', respuesta({ message: 'aun sin configurar' }))
})

app.post('/conectar', async (req, res) => {
    const datos = req.body;
    try {
        print.setHost(datos.ip_impresora, datos.puerto)
        const isExito = await print.conectar()
        if (isExito) return res.render('conexion.html', respuesta())
        if (!isExito) return res.render('conexion.html', respuestaError())
    } catch (error) {
        console.log(error)
        return res.render('conexion.html', respuestaError())
    }
})

app.get('/test', async (req, res) => {
    const isExito = await print.printTest()
    if(isExito) res.send('Ticket impreso. con exito.')
    if(!isExito) res.send('sucedio un error.')
})

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
