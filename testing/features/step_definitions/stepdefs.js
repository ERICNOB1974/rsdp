const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const {httpRequest} = require ('./request');
const request = require('sync-request');

Given('que se ingresa el cliente con {string}, {string} y {string}', 
function (nombre, cuit, observaciones) {

    this.empresa = JSON.stringify({
        "nombre": nombre,
        "cuit": cuit,
        "observaciones": observaciones
    });

});

When('presiono el botón de guardar',
function () {
    this.response = httpRequest('POST', 'http://backend:8080/empresas', this.empresa);
});

Then('se espera la siguiente {string}', 
function (expectedAnswer) {
    assert.equal(this.response.message, expectedAnswer);
});










Given('la empresa con nombre {string} y cuit {string}', 
function (nombre, cuit) {

    this.empresa = httpRequest('GET',`http://backend:8080/empresas/cuit/${cuit}`);

});

Given('que se ingresa el proyecto con código {string} y descripción {string}', 
function (codigo, descripcion) {
    
    this.proyecto = {
        codigo: codigo,
        descripcion: descripcion
    };

});

When('se solicitan guardar el nuevo proyecto', 
function () {
    const requestData = {
        codigo: this.proyecto.codigo,
        descripcion: this.proyecto.descripcion,
        empresa: {
            id: this.empresa.data.id,
            nombre: this.empresa.data.nombre,
            cuit: this.empresa.data.cuit,
            observaciones: this.empresa.data.observaciones
        },
        tareas: []
    };
    this.response = httpRequest('POST', 'http://backend:8080/proyectos', JSON.stringify(requestData));
});

Then('se obtiene la siguiente {string}', 
function (expectedAnswer) {
    assert.equal(this.response.message, expectedAnswer);
});










Given('el proyecto con código {string} que pertenece al cliente cuit {string} y nombre {string}', 
function (codigo, cuit, nombre) {

    this.proyecto = httpRequest('GET',encodeURI(`http://backend:8080/proyectos/codigo/${codigo}`)).data;

});

Given('la tarea con codigo {string} y  descripcion {string}', 
function (codigo, descripcion) {
    
    this.tarea = {
        codigo: codigo,
        descripcion: descripcion
    };

});

When('se solicitan guardar una nueva tarea al proyecto', 
function () {

    this.proyecto.tareas.push(this.tarea);

    this.response = httpRequest('PUT', 'http://backend:8080/proyectos', JSON.stringify(this.proyecto));
});