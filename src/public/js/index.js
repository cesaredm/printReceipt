const formInicial = document.getElementById('configuracion_inicial')

formInicial.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('eyy')
    const datos = new FormData(formInicial)
    const ip_impresora = datos.get('ip_impresora')
    const puerto = datos.get('puerto')
    fetch('/conectar', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ ip_impresora, puerto })
    }).then(res => res.json()).then(res => {
        alert(res.message)
    }).catch(error => console.log(error));
})
