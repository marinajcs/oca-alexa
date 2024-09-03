/**
 * Simula el lanzamiento de un dado de seis caras.
 * @returns {number} Un entero aleatorio entre 1 y 6, representando el resultado de la tirada.
 */
function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}

/**
 * Obtiene la URL del video correspondiente a la tirada de dado, que se almacena en el servicio de Amazon S3.
 * @param {number} n El número obtenido al tirar el dado, que debe estar entre 1 y 6.
 * @returns {string} La URL del video que muestra la animación del lanzamiento de dado.
 * @description Devuelve la URL de un video específico basado en el número del dado. Cada resultado tiene una animación asociada.
 */
function getUrlDado(n) {
    let url;
    switch(n) {
        case 1:
            url = "https://bucket-oca.s3.eu-west-1.amazonaws.com/videos-dado/dado-num-1.mp4";
            break;
        case 2:
            url = "https://bucket-oca.s3.eu-west-1.amazonaws.com/videos-dado/dado-num-2.mp4";
            break;
        case 3:
            url = "https://bucket-oca.s3.eu-west-1.amazonaws.com/videos-dado/dado-num-3.mp4";
            break;
        case 4:
            url = "https://bucket-oca.s3.eu-west-1.amazonaws.com/videos-dado/dado-num-4.mp4";
            break;
        case 5:
            url = "https://bucket-oca.s3.eu-west-1.amazonaws.com/videos-dado/dado-num-5.mp4";
            break;
        case 6:
            url = "https://bucket-oca.s3.eu-west-1.amazonaws.com/videos-dado/dado-num-6.mp4";
            break;
    }
    return url;
}

module.exports = {
    tirarDado,
    getUrlDado
};
