const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existente {string}, en amigos por eventos', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de amigos basados en eventos', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasDeAmigosBasadosEnEventos/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.publicaciones;
        delete res.rutinas;
        delete res.id;
        delete res.amigos;
        delete res.rutinasEmpezadas;
        delete res.descripcion;
        delete res.fechaNacimiento;
        delete res.fechaDeCreacion;
    }

});

Then('se espera que las sugerencias de amigos basados en eventos sean', 
function (recomendacionesAmigosDeEventosString) {

    this.recomendacionesAmigosDeEventos = JSON.parse(recomendacionesAmigosDeEventosString).data;
    
    let recomendacionesAmigosDeEventosOrdenados = ordenar(this.recomendacionesAmigosDeEventos);
    let resultOrdenado = ordenar(this.result);
    
    assert.equal(recomendacionesAmigosDeEventosOrdenados, resultOrdenado);
    
});