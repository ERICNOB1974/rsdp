const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existent {string}', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});
When('se buscan las sugerencias de eventos basados en comunidades', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/eventos/sugerenciasDeEventosBasadosEnComunidades/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.id;
        delete res.descripcion;
        delete res.cantidadMaximaParticipantes;
        delete res.esPrivadoParaLaComunidad;
        delete res.participantes;
        delete res.etiquetas;
        delete res.creador;
        delete res.organiza;
    }
});

Then('se espera que las sugerencias de eventos basados en comunidades sean',
    function (recomendacionesString) {

        this.recomendaciones = JSON.parse(recomendacionesString).data;

        let recomendacionesOrdenadas = ordenar(this.recomendaciones);
        let resultOrdenado = ordenar(this.result);

        assert.equal(recomendacionesOrdenadas, resultOrdenado);

    });


