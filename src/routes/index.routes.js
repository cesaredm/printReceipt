import { Router } from "express";
import { print } from "../controllers/Print.js";
import { respuesta, respuestaError } from "../helpers/tools.js";
/*const { Router } = require('express')
const { respuesta, respuestaError } = require('../helpers/tools')
const print = require('../controllers/Print')*/

const router = Router()

router.get('/', (req, res) => {
    return res.render('index.html', respuesta({ message: 'aun sin configurar' }))
})

router.post('/conectar', async (req, res) => {
    const datos = req.body;
    try {
        print.setHost(datos.ip_impresora, datos.puerto)
        const { isConectado, message, printModel } = await print.conectar()
        if (isConectado) return res.render('conexion.html', respuesta({ message }))
        if (!isConectado) return res.render('conexion.html', respuestaError({ message }))
        //return res.status(200).render('conexion.html', respuesta())
    } catch (error) {
        console.log(error)
        //return res.status(404).send(respuestaError())
        return res.render('conexion.html', respuestaError())
    }
})

router.get('/test', async (req, res) => {
    try {
        const { isPrint } = await print.printTest()
        if (isPrint) res.send('Ticket impreso. con exito.')
        if (!isPrint) res.send('sucedio un error.')
    } catch (error) {

        res.send('sucedio un error.')
    }

})

router.get('/ticket', async (req, res) => {
    try {
        const { isPrint, message } = await print.imprimirTicket()
        if (isPrint) return res.send(message)
        if (!isPrint) return res.send('error al imprimir')
    } catch (error) {
        console.log(error)
        return res.send('Erorr al imprimir')
    }
})

export default router;

//module.exports = router;