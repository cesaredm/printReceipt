import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder'
import NetworkReceiptPrinter from '@point-of-sale/network-receipt-printer'

class Print {
    #encoder;
    #printer;

    setHost(host, port) {
        this.#printer = new NetworkReceiptPrinter({ host, port });
        this.#encoder = new ReceiptPrinterEncoder({
            language: 'esc-pos',
            codepageMapping: 'epson'
        });
    }

    async conectar() {
        try {
            await this.#printer.connect()
            this.#printer.addEventListener('connected', (device) => {
                console.log('conected to printer', device)
                return true
            })
        } catch (error) {
            console.error('Error al conectar a la impresora:', error);
            return false
        }

    }

    async printTest() {
        try {
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
            await this.#printer.print(receipt)
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }

    }
}

export const print = new Print()