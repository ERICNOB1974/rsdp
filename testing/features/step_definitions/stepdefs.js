const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const {httpRequest} = require ('./plays');

Given('que se ingresa el operario con legajo {int}, con nombre {string} cuya categoría es {string}', 
    
    function (legajo, nombre, categoria) {
        this.operador = JSON.stringify({
            "legajo": legajo,
            "nombre": nombre,
            "categoria": categoria
        });
    });

When(
    'presiono el botón de guardar',
    function () {
        this.response = httpRequest('POST', 'http://backend:8080/operadores', this.operador);
    });
    
Then('se espera la siguiente {string}', 
function (expectedAnswer) {
    assert.equal(this.response.message, expectedAnswer);
});