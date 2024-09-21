const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
const request = require('sync-request');

Given('que se ingresan los datos de un usuario existent {string}', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});
When('se buscan las sugerencias de amigos basados en comunidades', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasDeAmigosBasadosEnComunidades/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.id;
        delete res.fechaNacimiento;
        delete res.fechaDeCreacion;
        delete res.correoElectronico;
        delete res.contrasena;
        delete res.descripcion;
        delete res.publicaciones;
        delete res.amigos;
        delete res.rutinasEmpezadas;
    }
});

Then('se espera que las sugerencias de amigos basados en comunidades sean',
    function (recomendacionesAmigosDeAmigosString) {

        this.recomendacionesAmigosDeAmigos = JSON.parse(recomendacionesAmigosDeAmigosString).data;

        let recomendacionesAmigosDeAmigosOrdenadas = ordenar(this.recomendacionesAmigosDeAmigos);
        let resultOrdenado = ordenar(this.result);

        assert.equal(recomendacionesAmigosDeAmigosOrdenadas, resultOrdenado);

    });


