const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existente {string}, en comunidades por amigos', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de comunidades basadas en amigos', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/comunidades/recomendarComunidadesPorAmigos/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.id;
        delete res.publicaciones;
        delete res.creador;
        delete res.administradores;
        delete res.miembros;
        delete res.etiquetas;
    }

});

Then('se espera que las sugerencias de comunidades basadas en amigos sean', 
function (recomendacionesComunidadesPorAmigosString) {

    this.recomendacionesComunidadesPorAmigos = JSON.parse(recomendacionesComunidadesPorAmigosString).data;
    
    let recomendacionesComunidadesPorAmigosOrdenadas = ordenar(this.recomendacionesComunidadesPorAmigos);
    let resultOrdenado = ordenar(this.result);
    
    assert.equal(recomendacionesComunidadesPorAmigosOrdenadas, resultOrdenado);
    
});