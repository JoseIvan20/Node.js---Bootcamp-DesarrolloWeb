import { Dropzone } from "dropzone";
// Le pasamos la etiqueta 'meta' de su vista 'agregar-imagen.pug'
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = { // .imagen -> Es una forma de acceder a una propiedad

    // Modificación del Dropzone
    dictDefaultMessage: 'Sube tus imagenes aquí.',
    // Archivos que soporta
    acceptedFiles: '.png, .jpg, .jpeg',
    // Tamaño de las imagenes
    maxFileSsize: 5,
    // Cantidad máxima de archivos
    maxFiles: 3,
    // Es la cantidad de archivos que estamos soportando
    paralleUploads: 3,
    // Evitamos que el usuario lo suba en automático, lo queremos manual
    autoProcessQueue: true,
    // Agrega un enlace para quitar la imagen
    addRemoveLinks: true,
    // Texto del borrar
    dictRemoveFile: 'Borrar Archivo',
    // Texto de aviso de la cantidad de imagenes por propiedad
    dictMaxFilesExceeded: 'El límite son 3 Archivos.',
    // Se envían antes de la petición, antes del cuerpo del req
    headers: {
        'CSRF-Token': token // Le pasamos el token del csrf
    }

}