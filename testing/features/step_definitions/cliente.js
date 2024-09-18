const { Given, When } = require('cucumber');
const request = require('sync-request');

Given('que se ingresa el cliente con {string} y {string}', function (razonSocial, cuit) {
    this.nuevoCliente = {
        "razonSocial": razonSocial,
        "cuit": cuit
    }
});

When('presiono el botón de guardar', function () {
    let req = request('POST', 'http://backend:8080/cliente', {
        json: this.nuevoCliente
    });
    this.actualAnswer = JSON.parse(req.body, 'utf8');

});


