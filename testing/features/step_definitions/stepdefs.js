const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');




Given('que se ingresan los datos de un usuario existente {string}', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de amigos en común', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasPorAmigosEnComun/${this.nombreUsuario}`)).data;


    for (let res of this.result) {
        delete res.publicaciones;
        delete res.rutinas;
        delete res.contrasena;
        delete res.id;
        delete res.amigos;
    }

});

Then('se espera que las sugerencias sean', 
function (recomendacionesAmigosDeAmigosString) {

    this.recomendacionesAmigosDeAmigos = JSON.parse(recomendacionesAmigosDeAmigosString).data;

    
    this.recomendacionesAmigosDeAmigos.sort((a, b) => a.nombreUsuario - b.nombreUsuario);
    this.result.sort((a, b) => a.nombreUsuario - b.nombreUsuario);
    
    let recomendacionesAmigosDeAmigosOrdenadas = ordenar(this.recomendacionesAmigosDeAmigos);
    let resultOrdenado = ordenar(this.result);
    
    assert.equal(recomendacionesAmigosDeAmigosOrdenadas, resultOrdenado);

});
