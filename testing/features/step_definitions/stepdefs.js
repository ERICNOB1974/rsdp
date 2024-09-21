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
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasDeAmigosBasadasEnAmigos/${this.nombreUsuario}`)).data;

    for (let res of this.result) {
        delete res.publicaciones;
        delete res.rutinas;
        delete res.contrasena;
        delete res.id;
        delete res.amigos;
        delete res.rutinasEmpezadas;
    }

});

Then('se espera que las sugerencias de amigos en común sean', 
function (recomendacionesAmigosDeAmigosString) {

    this.recomendacionesAmigosDeAmigos = JSON.parse(recomendacionesAmigosDeAmigosString).data;
    
    let recomendacionesAmigosDeAmigosOrdenadas = ordenar(this.recomendacionesAmigosDeAmigos);
    let resultOrdenado = ordenar(this.result);
    
    assert.equal(recomendacionesAmigosDeAmigosOrdenadas, resultOrdenado);
    
});










When('se obtienen las sugerencias de amigos en común cuando se tienen dos amigos', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasDeAmigosBasadasEnAmigos/${this.nombreUsuario}`)).data;

    this.result.sort((a, b) => a.id - b.id);

    for (let res of this.result) {
        delete res.publicaciones;
        delete res.rutinas;
        delete res.contrasena;
        delete res.id;
        delete res.amigos;
        delete res.rutinasEmpezadas;
    }

});











When('se obtienen las sugerencias de rutinas basadas en comunidades', function () {
    this.resultado = httpRequest('GET', encodeURI(`http://backend:8080/rutinas/sugerenciasDeRutinasBasadasEnComunidades/${this.nombreUsuario}`)).data;

    for (let res of this.resultado) {
        delete res.dificultad;
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
    }

});

Then('se espera que las sugerencias de rutinas basadas en comunidades sean', 
function (recomendacionesRutinasPorComunidadesString) {

    this.recomendacionesRutinasPorComunidades = JSON.parse(recomendacionesRutinasPorComunidadesString).data;
    
    let recomendacionesRutinasPorComunidadesOrdenadas = ordenar(this.recomendacionesRutinasPorComunidades);
    let resultOrdenado = ordenar(this.resultado);
    
    assert.equal(recomendacionesRutinasPorComunidadesOrdenadas, resultOrdenado);
    
});












When('se obtienen las sugerencias de rutinas basadas en rutinas', function () {
    this.resultado = httpRequest('GET', encodeURI(`http://backend:8080/rutinas/sugerenciasDeRutinasBasadasEnRutinas/${this.nombreUsuario}`)).data;

    for (let res of this.resultado) {
        delete res.dificultad;
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
    }

});

Then('se espera que las sugerencias de rutinas basadas en rutinas sean', 
function (recomendacionesRutinasPorRutinasString) {

    this.recomendacionesRutinasPorRutinas = JSON.parse(recomendacionesRutinasPorRutinasString).data;
    
    let recomendacionesRutinasPorRutinasOrdenadas = ordenar(this.recomendacionesRutinasPorRutinas);
    let resultOrdenado = ordenar(this.resultado);
    
    assert.equal(recomendacionesRutinasPorRutinasOrdenadas, resultOrdenado);
    
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