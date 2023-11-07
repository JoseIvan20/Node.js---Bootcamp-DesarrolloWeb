/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Función que se invoca así misma\n(function() {\n\n    // Leeremos los datos que extraigamos del PIN u posición en el mapa\n    const lat = document.querySelector('#lat').value || 19.5575357; // Latitud\n    const lng = document.querySelector('#lng').value || -99.1246216; // Longitud\n    const mapa = L.map('mapa').setView([lat, lng ], 16);\n    \n    // Crear variable para añadir un PIN con laubicación de la Propiedad\n    let marker;\n\n    // Utilizar Provider y Geocoder\n    const geocodeService = L.esri.Geocoding.geocodeService();\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    // El PIN\n    marker = new L.marker([lat, lng], {\n        draggable: true, // True para poder moverlo\n        autoPan:true, //True para hacer zoom automático cuando el usuario arrastre el pin a otra parte del mapa\n        title:\"Mi primer pin\",\n        alt:\"Pin\",\n        // icon : \"/public/svg/pin.svg\",\n    })\n    .addTo(mapa) \n\n    // Detectar el movimiento del pin\n    marker.on('moveend', function (e) {\n        marker = e.target\n        \n        // Declaramos una variable para almacenar la Lat y Lng\n        const posicion = marker.getLatLng();\n\n        mapa.panTo( new L.LatLng(posicion.lat, posicion.lng) ) // panTo lo que harà es centrar al momento de soltar el pin, y lo centraremos a las coordenadas respectivas\n\n        // Obtener la información de las calles al soltar el PIN\n        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {\n            // console.log(resultado)\n\n            marker.bindPopup(resultado.address.LongLabel);\n\n            // Llamar a los campos para extraer la calle, lat y lng\n            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''; // textContent = Es algo que será visible \n            document.querySelector('#calle').value = resultado?.address?.Address ?? ''; // Calle\n            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''; // Latitud\n            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''; // Longitud\n\n        }) \n\n    })\n\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;