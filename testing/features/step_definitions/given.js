const { Given } = require('cucumber');

Given('que se ingresan los datos de un usuario existente {string}', function (nombreUsuario) {
    this.nombreUsuario = nombreUsuario;
});