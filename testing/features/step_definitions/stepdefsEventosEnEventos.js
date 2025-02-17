const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existente {string}, en eventos por eventos', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de eventos basados en eventos', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/eventos/sugerenciasDeEventosBasadosEnEventos/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.id;
    }

});

Then('se espera que las sugerencias de eventos basados en eventos sean', 
function (recomendacionesEventosPorEventosString) {

    this.recomendacionesEventosPorEventos = JSON.parse(recomendacionesEventosPorEventosString).data;
    
    let recomendacionesEventosPorEventosOrdenadas = ordenar(this.recomendacionesEventosPorEventos);
    let resultOrdenado = ordenar(this.result);
    
    assert.equal(recomendacionesEventosPorEventosOrdenadas, resultOrdenado);
    
});