const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');

Given('se ingresan los datos de un usuario existente {string}', function(nombreUsuario) {
});

Given('el usuario {string} participa en eventos', function(nombreUsuario) {

});

When('se obtienen las sugerencias de eventos basados en eventos', function() {
    // Realizamos la solicitud HTTP para obtener las sugerencias
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/eventos/sugerenciasDeEventosBasadosEnEventos/${this.nombreUsuario}`)).data;

    // Eliminamos atributos innecesarios
    for (let res of this.result) {
        delete res.creador;
        delete res.id;
        delete res.esPrivadoParaLaComunidad;
        delete res.participantes;
        delete res.etiquetas;
        delete res.organiza;
    }
});

Then('se espera que los eventos sugeridos sean', function(eventosEsperadosString) {
    // Parseamos la cadena esperada a JSON
    this.eventosEsperados = JSON.parse(eventosEsperadosString).data;

    // Ordenamos ambas listas para asegurarnos de que coincidan
    let eventosEsperadosOrdenados = ordenar(this.eventosEsperados);
    let resultOrdenado = ordenar(this.result);
    
    // Comparamos las sugerencias esperadas con las obtenidas
    assert.equal(eventosEsperadosOrdenados, resultOrdenado);
});