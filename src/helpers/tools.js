export function respuesta(data={}){
    return {
        ...data,
        status:'exito',
        message:'Operacion realizada con exito.',
    }
}
export function respuestaError(data={}){
    return {
        ...data,
        status:'error',
        message:'Operacion fallida.',
    }
}

/*module.exports = {
    respuesta,
    respuestaError
}*/