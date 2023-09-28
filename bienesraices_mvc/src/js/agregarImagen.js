import { Dropzone } from "dropzone";
// Le pasamos la etiqueta 'meta' de su vista 'agregar-imagen.pug'
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = { // .imagen -> Es una forma de acceder a una propiedad

    // Modificación del Dropzone
    dictDefaultMessage: 'Sube tú imagen aquí.',
    // Archivos que soporta
    acceptedFiles: '.png, .jpg, .jpeg',
    // Tamaño de las imagenes
    maxFilesize: 5,
    // Cantidad máxima de archivos
    maxFiles: 1,
    // Es la cantidad de archivos que estamos soportando
    parallelUploads: 1,
    // Evitamos que el usuario lo suba en automático, lo queremos manual
    autoProcessQueue: false,
    // Agrega un enlace para quitar la imagen
    addRemoveLinks: true,
    // Texto del borrar
    dictRemoveFile: 'Borrar Archivo',
    // Texto de aviso de la cantidad de imagenes por propiedad
    dictMaxFilesExceeded: 'El límite es de 1 archivo.',
    // Se envían antes de la petición, antes del cuerpo del req
    headers: {
        'CSRF-Token': token // Le pasamos el token del csrf
    },
    // Creamos un nombre para el parámetro, si embargo, 'imagen', hará referenicia al archivo de propiedadesRoutes.js del upload.array('imagen')
    paramName: 'imagen',
    // Nos va a permitir sobreescribir sobre el objeto de eventos de Dropzone, son funciones que podemos registrar cuando inicie Dropzone
    init: function () {
        
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar') // Id de botón 

        btnPublicar.addEventListener('click', function () {

            dropzone.processQueue() // Procesamos los archivos en automático

        })

        dropzone.on('queuecomplete', function() {

            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'            }

        })

    }

}