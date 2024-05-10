const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const {httpRequest} = require ('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');

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
function (respuesta) {
    assert.equal(this.response.message, respuesta);
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
function (respuesta) {
    assert.equal(this.response.message, respuesta);
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










Given('que se ingresa el operario con legajo {int}, con nombre {string} cuya categoría es {string} y pertenece al turno {string} a partir de {string}', 
function (legajo, nombre, categoria, turno, fechaTurnoDesde) {
    
    this.operario = {
        legajo: legajo,
        nombre: nombre,
        categoria: categoria,
        turno: turno,
        fechaTurnoDesde: fechaTurnoDesde
    };

});

When('presiono el botón de guardar de operarios', 
function () {

    this.response = httpRequest('POST', 'http://backend:8080/operarios', JSON.stringify(this.operario));

});










Given('el operario con legajo {int} y nombre {string} que trabaja en el turno {string} desde {string}', 
function (legajo, nombre, turno, fechaTurnoDesde) {

    this.operario = httpRequest('GET',encodeURI(`http://backend:8080/operarios/legajo/${legajo}`)).data;

});

Given('que trabajó el día {string} para el proyecto {string} en la tarea {string} desde las {string} horas hasta las {string} horas', 
function (fechaParte, proyecto, tarea, horaDesde, horaHasta) {
    
    this.proyecto = httpRequest('GET',encodeURI(`http://backend:8080/proyectos/codigo/${proyecto}`)).data;

    this.tarea = httpRequest('GET',encodeURI(`http://backend:8080/tareas/codigo/${tarea}`)).data;

    const horas = horaHasta-horaDesde;

    this.parteMO = {
        fecha: fechaParte,
        horaDesde: horaDesde,
        horaHasta: horaHasta,
        horas: horaHasta-horaDesde,
        operario: this.operario,
        proyecto: this.proyecto,
        tarea: this.tarea
    };

});

When('se solicitan generar el parte', 
function () {

    this.response = httpRequest('POST', 'http://backend:8080/partes', JSON.stringify(this.parteMO));

});

Then('se obtiente {int} con {string}', 
function (status, respuesta) {
    assert.equal(this.response.status, status);
    assert.equal(this.response.message, respuesta);
});











Given('los partes cargados', 
function () {
    return true;
});

When('se solicitan obtener el resumen de partes por día y operario', 
function () {
    this.resumenObtenido = httpRequest('GET',encodeURI(`http://backend:8080/partes/informeGeneral`)).data;
});

Then('se obtiene el siguiente resumen', 
function (resumenString) {
    let resumenEsperado = JSON.parse(resumenString).resumenPartesMO;
    
    for (let res of this.resumenObtenido) {
        delete res.fecha;
    }

    let resumenObtenidoOrdenado = ordenar(this.resumenObtenido);
    
    let resumenEsperadoOrdenado = ordenar(resumenEsperado);

    assert.equal(resumenObtenidoOrdenado, resumenEsperadoOrdenado);
});












Given('el siguiente listado de partes de mano de obra en estado a validar', 
function (partesString) {

    let partesEsperados = JSON.parse(partesString).partesMO;
    this.partesObtenidos = httpRequest('GET',encodeURI(`http://backend:8080/partes`)).data;

    for (let pmo of this.partesObtenidos) {
        delete pmo.id;
        delete pmo.horas;
        delete pmo.estado.id;
        delete pmo.operario.id;
        delete pmo.operario.categoria;
        delete pmo.operario.turno;
        delete pmo.operario.fechaTurnoDesde;
        delete pmo.proyecto.id;
        delete pmo.proyecto.empresa;
        delete pmo.proyecto.tareas;
        delete pmo.tarea.id;
        pmo.fecha = pmo.fecha.substring(0, 10);
    }
    for (let pmo of partesEsperados) {
        delete pmo.id;
        delete pmo.estado.id;
        delete pmo.operario.id;
        delete pmo.proyecto.id;
        delete pmo.tarea.id;
    }
    let partesEsperadosOrdenados = ordenar(partesEsperados);
    let partesObtenidosOrdenados = ordenar(this.partesObtenidos);

    console.log(partesEsperadosOrdenados);
    console.log(partesObtenidosOrdenados);

    assert.equal(partesObtenidosOrdenados, partesEsperadosOrdenados);

});

When('se solicita validar los partes a la fecha {string}', 
function () {
    return 'pending';
});

Then('se obtiene la siguiente respuesta', 
function (resumenString) {
    return 'pending';
});