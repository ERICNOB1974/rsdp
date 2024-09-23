const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');



Given('{string} participa en el evento {string}', function (nombreUsuario, evento) {

});

Given('{string} realiza rutinas etiquetadas con {string} y {string}', function (nombreUsuario, etiqueta1, etiqueta2) {
});
Given('{string} realiza rutinas etiquetadas con {string}', function (nombreUsuario, etiqueta1) {
});

Given('{string} crea el evento {string}', function (nombreUsuario, evento) {
    // Simula que el usuario crea el evento
    this.eventoCreado = evento;
});

Given('{string} realiza rutinas etiquetadas con {string}, {string}, {string} y {string}', function (nombreUsuario, etiqueta1, etiqueta2, etiqueta3, etiqueta4) {

});

When('se obtienen las sugerencias de eventos basadas en rutinas', function () {
    // Realizamos la solicitud HTTP para obtener las sugerencias
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/eventos/sugerenciasDeEventosBasadosEnRutinas/${this.nombreUsuario}`)).data;

    // Eliminamos atributos innecesarios
    for (let res of this.result) {
        delete res.etiquetas;
        delete res.participantes;
        delete res.creador;
        delete res.id;
        delete res.organiza;
        delete res.esPrivadoParaLaComunidad;
        delete res.cantidadMaximaParticipantes;
    }
});

Then('se espera que los eventos sugeridos para {string} sean', function (nombreUsuario, eventosEsperadosString) {
    // Parseamos la cadena esperada a JSON
    this.eventosEsperados = JSON.parse(eventosEsperadosString).data;

    // Ordenamos ambas listas para asegurarnos de que coincidan
    let eventosEsperadosOrdenados = ordenar(this.eventosEsperados);
    let resultOrdenado = ordenar(this.result);

    // Comparamos las sugerencias esperadas con las obtenidas
    assert.equal(eventosEsperadosOrdenados, resultOrdenado);
});
