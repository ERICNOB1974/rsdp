const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existente {string}, en rutinas por rutinas', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de rutinas basadas en rutinas', function () {
    this.resultado = httpRequest('GET', encodeURI(`http://backend:8080/rutinas/sugerenciasDeRutinasBasadasEnRutinas/${this.nombreUsuario}`)).data;

    for (let res of this.resultado) {
        delete res.dificultad;
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
    }

});

Then('se espera que las sugerencias de rutinas basadas en rutinas sean', 
function (recomendacionesRutinasPorRutinasString) {

    this.recomendacionesRutinasPorRutinas = JSON.parse(recomendacionesRutinasPorRutinasString).data;
    
    let recomendacionesRutinasPorRutinasOrdenadas = ordenar(this.recomendacionesRutinasPorRutinas);
    let resultOrdenado = ordenar(this.resultado);
    
    assert.equal(recomendacionesRutinasPorRutinasOrdenadas, resultOrdenado);
    
});