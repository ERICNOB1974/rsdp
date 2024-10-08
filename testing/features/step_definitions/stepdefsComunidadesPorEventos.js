const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existente {string}, en comunidades por eventos', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de comunidades basadas en eventos', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/comunidades/sugerenciasDeComunidadesBasadasEnEventos/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.id;
    }

});

Then('se espera que las sugerencias de comunidades basadas en eventos sean', 
function (recomendacionesComunidadesPorEventosString) {

    this.recomendacionesComunidadesPorEventos = JSON.parse(recomendacionesComunidadesPorEventosString).data;
    
    let recomendacionesComunidadesPorEventosOrdenadas = ordenar(this.recomendacionesComunidadesPorEventos);
    let resultOrdenado = ordenar(this.result);
    
    assert.equal(recomendacionesComunidadesPorEventosOrdenadas, resultOrdenado);
    
});