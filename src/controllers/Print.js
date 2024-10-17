import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder'
import NetworkReceiptPrinter from '@point-of-sale/network-receipt-printer'
import ReceiptPrinterStatus from '../lib/receipt-printer-status.esm.js'
import { logoCDsoft } from '../lib/logo.js';

/*const NetworkReceiptPrinter = require('@point-of-sale/network-receipt-printer')
const ReceiptPrinterEncoder = require('@point-of-sale/receipt-printer-encoder')
const ReceiptPrinterStatus = require('../lib/receipt-printer-status.esm')*/

class Print {
    #encoder;
    #printer;
    #printerStatus

    constructor() {

    }

    getPrinter() {
        return this.#printer
    }

    getPrinterStatus() {
        return this.#printerStatus
    }

    setHost(host, port) {
        this.#printer = new NetworkReceiptPrinter({ host, port });
        this.#encoder = new ReceiptPrinterEncoder({
            language: 'esc-pos',
            codepageMapping: 'epson'
        });
    }

    async conectar() {
        return new Promise((resolve, reject) => {
            //conectar impresora
            this.#printer.connect()
            //evento de conexion de impresora
            this.#printer.addEventListener('connected', (device) => {
                // instancia para recivir informacion de la impresora
                this.#printerStatus = new ReceiptPrinterStatus({
                    printer: this.#printer, // conexion de impresora 
                    language: 'esc-pos' // lenguaje de la impresora - si no se pasa lo hara solo 
                })
                // evento de conexion para informacion de la impresora
                this.#printerStatus.addEventListener('connected', async () => {
                    console.log('impresora conectada')
                    // obtenemos informacion de la impresora
                    const printModel = await this.#printerStatus.query('model')
                    console.log('Impresora modelo ' + printModel + ' Conectada con exito')

                    return resolve({ isConectado: true, printModel, message: 'Impresora conectada con exito' })
                })
                this.#printerStatus.addEventListener('unsupported', () => {
                    console.log('No se puede acceder a la informacion')
                    return resolve({ isConectado: true, message: "conectado, pero no se puede acceder a la informacion de la impresora" })
                });
                this.#printerStatus.addEventListener('disconnected', () => {
                    console.log('la impresora se deconecto')
                    return resolve({ isConectado: false, message: 'Impresora desconectada' })
                });
            })

            this.#printer.addEventListener('disconnected', () => {
                return resolve({ isConectado: false, message: 'Impresora desconectada' })
            })
        })
    }

    async printTest() {
        return new Promise((resolve, reject) => {
            let receipt = this.#encoder.initialize()
                .text('hola mundo')
                .newline()
                .text('desde CDstore by CDsoft')
                .newline()
                .text('Esta es una prueba')
                .table(
                    [
                        { width: 36, marginRight: 2, align: 'left' },
                        { width: 10, align: 'right' }
                    ],
                    [
                        ['Item 1', '€ 10,00'],
                        ['Item 2', '15,00'],
                        ['Item 3', '9,95'],
                        ['Item 4', '4,75'],
                        ['Item 5', '211,05'],
                        ['', '='.repeat(10)],
                        ['Total', (encoder) => encoder.bold().text('€ 250,75').bold()],
                    ]
                )
                .encode();
            this.#printer.print(receipt)
            return resolve({ isPrint: true, message: 'Ticket impreso con exito.' })
        })

    }

    imprimirTicket() {
        return new Promise((resolve, reject) => {
            /*const image = new Image();
            image.src = logoCDsoft;
            image.decode();*/
            const ticket = this.#encoder
                .initialize()
                .codepage('auto')
                .align('center')
                //.image(image, 128, 128, 'atkinson')
                .line('Logo de tienda')
                .align('center')
                .bold()
                .line('CDsoft')
                .bold(false)
                .align('left')
                .newline()
                .bold()
                .text('rut: ').bold(false).text('45454545455')
                .newline()
                .bold()
                .text('Direccion: ')
                .bold(false).text('La fraternidad, 2 c al norte del lago, san marcos de colon')
                .newline()
                .bold()
                .text('Telefono: ').bold(false).text('87760151')
                .newline()
                .bold()
                .text('Fecha: ').bold(false).text('15/10/2024, 03:34:54 am')
                .newline()
                .bold()
                .text('Tipo venta: ').bold(false).text('Efectivo')
                .newline()
                .bold()
                .text('Atendido por: ').bold(false).text('Cajero #2')
                .newline()
                .bold()
                .text('Factura N°: ').bold(false).text('448')
                .newline()
                .bold()
                .text('Comprador: ').bold(false).text('Danny Flores')
                .newline()
                .rule({ style: "single" })
                .table(
                    [
                        { width: 200, align: 'left' },
                        { width: 12, align: 'left' },
                        { width: 15, align: 'right' },
                        { width: 15, align: 'right' },
                    ],
                    [
                        [
                            (encoder) => encoder.text(''),
                            (encoder) => encoder.bold().text('Cant').bold(false),
                            (encoder) => encoder.bold().text('Precio').bold(false),
                            (encoder) => encoder.bold().text('Importe').bold(false),
                        ],
                        [(encoder) => encoder.text('').height(1),
                        (encoder) => encoder.rule(),
                        (encoder) => encoder.rule(),
                        (encoder) => encoder.rule(),
                        ],
                        [
                            (encoder) => encoder.bold().text('pizza hawaiana con vegetales y peperoni servida'),
                            '2.00',
                            '420.00',
                            '840.00'
                        ],
                        [
                            (encoder) => encoder.bold().text('pizza hawaiana con vegetales y peperoni servida con empaque familiar de 8 pedazos '),
                            '2.00',
                            '420.00',
                            '840.00'
                        ],
                        [
                            (encoder) => encoder.bold().text('Jalapeno'),
                            '2.00',
                            '420.00',
                            '840.00'
                        ],
                        [
                            (encoder) => encoder.bold().text('Cola de res'),
                            '2.00',
                            '420.00',
                            '840.00'
                        ],
                        [
                            (encoder) => encoder.bold().text('Empaque'),
                            '2.00',
                            '420.00',
                            '840.00'
                        ],
                        [
                            (encoder) => encoder.bold().text('Michelada tona clasica'),
                            '2.00',
                            '420.00',
                            '840.00'
                        ],
                    ]
                )
                .rule()
                .table(
                    [
                        { width: 12, align: 'left' },
                        { width: 30, align: 'right' },
                    ],
                    [
                        [
                            'Sub C$', '1256.00'
                        ],
                        [
                            'Sub $', '0.00'
                        ],
                        [
                            'Desc C$', '0.00'
                        ],
                        [
                            'Desc $', '0.00'
                        ],
                        [
                            'Total C$', '1256.00'
                        ],
                        [
                            'Total $', '0.00'
                        ],
                    ]
                )
                .rule()
                .align('center')
                .line('---------- Mensage de la tienda -------')
                .newline().encode();

            this.#printer(ticket)

            return resolve({ isPrint: true, message: 'Ticket impreso con exito' })
        })

    }

}

export const print = new Print()

//module.exports = new Print() 