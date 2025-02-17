const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existente {string}, en rutinas por comunidades', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de rutinas basadas en comunidades', function () {
    this.resultado = httpRequest('GET', encodeURI(`http://backend:8080/rutinas/sugerenciasDeRutinasBasadasEnComunidades/${this.nombreUsuario}`)).data;

    for (let res of this.resultado) {
        delete res.dificultad;
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
    }

});

Then('se espera que las sugerencias de rutinas basadas en comunidades sean', 
function (recomendacionesRutinasPorComunidadesString) {

    this.recomendacionesRutinasPorComunidades = JSON.parse(recomendacionesRutinasPorComunidadesString).data;
    
    let recomendacionesRutinasPorComunidadesOrdenadas = ordenar(this.recomendacionesRutinasPorComunidades);
    let resultOrdenado = ordenar(this.resultado);
    
    assert.equal(recomendacionesRutinasPorComunidadesOrdenadas, resultOrdenado);
    
});