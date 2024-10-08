const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existente {string}, en comunidades por comunidades', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de comunidades basadas en comunidades', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/comunidades/sugerenciasDeComunidadesBasadasEnComunidades/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.id;
    }

});

Then('se espera que las sugerencias de comunidades basadas en comunidades sean', 
function (recomendacionesComunidadesPorComunidadesString) {

    this.recomendacionesComunidadesPorComunidades = JSON.parse(recomendacionesComunidadesPorComunidadesString).data;
    
    let recomendacionesComunidadesPorComunidadesOrdenadas = ordenar(this.recomendacionesComunidadesPorComunidades);
    let resultOrdenado = ordenar(this.result);
    
    assert.equal(recomendacionesComunidadesPorComunidadesOrdenadas, resultOrdenado);
    
});