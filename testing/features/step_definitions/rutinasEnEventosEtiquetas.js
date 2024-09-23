const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');


When('se buscan las sugerencias de rutinas basadas en eventos etiquetados', function () {
    this.result = httpRequest('GET', encodeURI(`http://backend:8080/rutinas/sugerenciasDeRutinasBasadosEnEventosPorEtiqueta/${this.nombreUsuario}`)).data;

    // Eliminamos atributos innecesarios
    for (let res of this.result) {
        delete res.ejercicios;
        delete res.etiquetas;
        delete res.id;
        delete res.creador;
    }
});

Then('se espera que las sugerencias de rutinas basadas en eventos etiquetados sean', function (recomendacionesRutinasString) {
    // Parseamos la cadena esperada a JSON
    this.recomendacionesRutinas = JSON.parse(recomendacionesRutinasString).data;

    // Ordenamos ambas listas para asegurarnos de que coincidan
    let recomendacionesRutinasOrdenadas = ordenar(this.recomendacionesRutinas);
    let resultOrdenado = ordenar(this.result);
    
    // Comparamos las sugerencias esperadas con las obtenidas
    assert.equal(recomendacionesRutinasOrdenadas, resultOrdenado);
});

