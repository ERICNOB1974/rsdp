const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');

Given('que se ingresan los datos de un usuario existente {string}', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});

When('se obtienen las sugerencias de rutinas basadas en amigos', function () {
    // Realizamos la solicitud HTTP para obtener las sugerencias
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasDeRutinasBasadasEnAmigos/${this.nombreUsuario}`)).data;

    // Eliminamos atributos innecesarios
    for (let res of this.result) {
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
        delete res.creador;
    }
});

Then('se espera que las sugerencias de rutinas sean', function (recomendacionesRutinasString) {
    // Parseamos la cadena esperada a JSON
    this.recomendacionesRutinas = JSON.parse(recomendacionesRutinasString).data;

    // Ordenamos ambas listas para asegurarnos de que coincidan
    let recomendacionesRutinasOrdenadas = ordenar(this.recomendacionesRutinas);
    let resultOrdenado = ordenar(this.result);
    
    // Comparamos las sugerencias esperadas con las obtenidas
    assert.equal(recomendacionesRutinasOrdenadas, resultOrdenado);
});

// Para el escenario donde el usuario ya realiza una de las rutinas
When('se obtienen las sugerencias de rutinas de amigos pero el usuario ya realiza una de ellas', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasDeRutinasBasadasEnAmigos/${this.nombreUsuario}`)).data;

    // Ordenamos por prioridad o popularidad
    this.result.sort((a, b) => b.popularidad - a.popularidad);

    // Eliminamos atributos innecesarios
    for (let res of this.result) {
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
        delete res.creador;
    }
});

// Para el escenario donde una de las rutinas tiene más amigos realizándola
When('se obtienen las sugerencias de rutinas y una de las rutinas tiene más amigos realizándola', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/usuarios/sugerenciasDeRutinasBasadasEnAmigos/${this.nombreUsuario}`)).data;

    // Ordenamos por la cantidad de amigos que realizan la rutina (popularidad)
    this.result.sort((a, b) => b.popularidad - a.popularidad);

    // Eliminamos atributos innecesarios
    for (let res of this.result) {
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
        delete res.creador;
    }
});
