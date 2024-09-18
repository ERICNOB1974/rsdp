const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const { httpRequest } = require('./request');
const ordenar = require('json-stable-stringify');
const borrarAtributo = require('js-remove-property');
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
    function (respuesta) {
        assert.equal(this.response.message, respuesta);
    });










Given('la empresa con nombre {string} y cuit {string}',
    function (nombre, cuit) {

        this.empresa = httpRequest('GET', `http://backend:8080/empresas/cuit/${cuit}`);

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

        this.proyecto = httpRequest('GET', encodeURI(`http://backend:8080/proyectos/codigo/${codigo}`)).data;

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










Given('que se ingresa el operario con legajo {int}, con nombre {string} cuya categoría es {string} y pertenece al turno {int} a partir de {string}',
    function (legajo, nombre, categoria, turno, fechaDesdeTurno) {
        this.tipoTurno = httpRequest('GET', `http://backend:8080/tipoTurnos/id/${turno}`).data;

        this.historicoTurnosObj = {
            fechaTurnoDesde: fechaDesdeTurno,
            fechaTurnoHasta: null,
            tipoTurno: this.tipoTurno
        };

        this.operario = {
            legajo: legajo,
            nombre: nombre,
            categoria: categoria,
            historicoTurnos: []
        };
        this.operario.historicoTurnos.push(this.historicoTurnosObj);
    });

When('presiono el botón de guardar de operarios',
    function () {
        this.responseOperario = httpRequest('POST', 'http://backend:8080/operarios', JSON.stringify(this.operario));
    });

Then('se espera la siguiente {string} de operarios',
    function (respuesta) {
        assert.equal(this.responseOperario.message, respuesta);
    });








Given('el operario con legajo {int} y nombre {string}',
    function (legajo, nombre) {

        this.operario = httpRequest('GET', encodeURI(`http://backend:8080/operarios/legajo/${legajo}`)).data;

    });

Given('que trabajó el día {string} para el proyecto {string} en la tarea {string} desde las {string} horas hasta las {string} horas',
    function (fechaParte, proyecto, tarea, horaDesde, horaHasta) {

        this.proyecto = httpRequest('GET', encodeURI(`http://backend:8080/proyectos/codigo/${proyecto}`)).data;

        this.tarea = httpRequest('GET', encodeURI(`http://backend:8080/tareas/codigo/${tarea}`)).data;

        this.parteMO = {
            fecha: fechaParte,
            horaDesde: horaDesde,
            horaHasta: horaHasta,
            horas: horaHasta - horaDesde,
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
        this.resumenObtenido = httpRequest('GET', encodeURI(`http://backend:8080/partes/informe/?page=0&size=500`)).data.content;
    });

Then('se obtiene el siguiente resumen',
    function (resumenString) {
        let resumenEsperado = JSON.parse(resumenString).resumenPartesMO;

        for (let res of this.resumenObtenido) {
            delete res.fecha;
            delete res.estado;
        }

        this.resumenObtenido.sort((a, b) => a.legajo - b.legajo);
        resumenEsperado.sort((a, b) => a.legajo - b.legajo);

        let resumenObtenidoOrdenado = ordenar(this.resumenObtenido);

        let resumenEsperadoOrdenado = ordenar(resumenEsperado);

        assert.equal(resumenObtenidoOrdenado, resumenEsperadoOrdenado);
    });












Given('el siguiente listado de partes de mano de obra en estado a validar',
    function (partesString) {

        let partesEsperados = JSON.parse(partesString).partesMO;
        this.partesObtenidos = httpRequest('GET', encodeURI(`http://backend:8080/partes`)).data;

        for (let pmo of this.partesObtenidos) {
            delete pmo.id;
            pmo.fecha = pmo.fecha.substring(0, 10);
            delete pmo.horas;
            delete pmo.operario.id;
            delete pmo.operario.categoria;
            delete pmo.operario.turno;
            delete pmo.operario.fechaTurnoDesde;
            delete pmo.operario.fechaTurnoHasta;
            delete pmo.operario.horaDesde;
            delete pmo.operario.horaHasta;
            delete pmo.operario.historicoTurnos;
            delete pmo.proyecto.id;
            delete pmo.proyecto.empresa;
            delete pmo.proyecto.tareas;
            delete pmo.tarea.id;
            delete pmo.estado.id;
            delete pmo.logsValidacion;
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

        assert.equal(partesObtenidosOrdenados, partesEsperadosOrdenados);

    });

When('se solicita validar los partes a la fecha {string}',
    function (fecha) {
        this.requestValidar = httpRequest('GET', encodeURI(`http://backend:8080/partes/validar/${fecha}`)).data;
        this.partesObtenidos = httpRequest('GET', encodeURI(`http://backend:8080/partes`)).data;
    });

Then('se obtiene la siguiente respuesta',
    function (partesString) {

        let partesEsperados = JSON.parse(partesString).partesMO;

        for (let pmo of this.partesObtenidos) {
            delete pmo.id;
            pmo.fecha = pmo.fecha.substring(0, 10);
            delete pmo.horas;
            delete pmo.operario.id;
            delete pmo.operario.categoria;
            delete pmo.operario.turno;
            delete pmo.operario.fechaTurnoDesde;
            delete pmo.operario.fechaTurnoHasta;
            delete pmo.operario.horaDesde;
            delete pmo.operario.horaHasta;
            delete pmo.operario.historicoTurnos;
            delete pmo.proyecto.id;
            delete pmo.proyecto.empresa;
            delete pmo.proyecto.tareas;
            delete pmo.tarea.id;
            delete pmo.estado.id;

            // Comprobación de si logsValidacion es un iterable
            if (Array.isArray(pmo.logsValidacion)) {
                if (pmo.logsValidacion) {
                    for (let log of pmo.logsValidacion) {
                        if (log.validacionParteMO.id === 5) {
                            delete pmo.logsValidacion;
                            break;
                        }
                        delete log.id;
                        delete log.estado.id;
                        delete log.validacionParteMO.id;
                        delete log.fecha;
                        delete log.tiempoCreacion;
                    }
                }
            } else {
                delete pmo.logsValidacion;
            }
        }

        for (let pmo of partesEsperados) {
            delete pmo.id;
            delete pmo.estado.id;
            delete pmo.operario.id;
            delete pmo.proyecto.id;
            delete pmo.tarea.id;

            // Comprobación de si logValidacion es un iterable
            if (Array.isArray(pmo.logsValidacion)) {
                for (let logs of pmo.logsValidacion) {
                    delete logs.id;
                    delete logs.estado.id;
                    delete logs.validacionParteMO.id;
                }
            } else {
                delete pmo.logValidacion;
            }
        }

        let partesEsperadosOrdenados = ordenar(partesEsperados);
        let partesObtenidosOrdenados = ordenar(this.partesObtenidos);

        assert.equal(partesObtenidosOrdenados, partesEsperadosOrdenados);

    });











Given('el parte "{string}" que está inválido',
    function (parteString) {

        parte = JSON.parse(parteString);

        this.parteObtenido = httpRequest('GET', encodeURI(`http://backend:8080/partes/parteDadoProyectoYTarea/${parte.fecha}/${parte.operario.legajo}/${parte.proyecto.codigo}/${parte.tarea.codigo}`)).data;

    });

When('se corrige el "{string}"',
    function (parteCorregidoString) {

        this.parteCorregido = JSON.parse(parteCorregidoString);

        if (this.parteCorregido.estado.nombre == 'validado') {
            this.parteValidado = httpRequest('GET', encodeURI(`http://backend:8080/partes/validarComoSupervisor/${this.parteCorregido.fecha}/${this.parteCorregido.operario.legajo}`));
        } else {
            this.parteCorregido.id = this.parteObtenido.id;
            this.parteCorregido.operario = this.parteObtenido.operario;
            this.parteCorregido.proyecto = this.parteObtenido.proyecto;
            this.parteCorregido.tarea = this.parteObtenido.tarea;
            this.parteCorregido.logsValidacion = this.parteObtenido.logsValidacion;
            let resultado = request('PUT',
                'http://backend:8080/partes', {
                json: this.parteCorregido
            });
            this.respuestaCorregido = JSON.parse(resultado.body);
        }
    });


Then('se espera el siguiente resultado de correccion de partes "{string}"',
    function (respuesta) {

        respuesta = JSON.parse(respuesta);

        if (this.parteValidado) {
            assert.equal(respuesta.StatusText, this.parteValidado.message);
            assert.equal(respuesta.StatusCode, this.parteValidado.status);
        } else {
            assert.equal(respuesta.StatusText, this.respuestaCorregido.message);
            assert.equal(respuesta.StatusCode, this.respuestaCorregido.status);
        }

    });

Given('el siguiente listado de partes de mano de obra en estado a validar para la correccion',
    function (partesString) {
        this.partesObtenidos = httpRequest('GET', encodeURI(`http://backend:8080/partes/partesEstadoCorregido`)).data;
    });

When('se solicita validar los partes a la fecha {string} para la correccion',
    function (fecha) {
        this.requestValidar = httpRequest('GET', encodeURI(`http://backend:8080/partes/validar/${fecha}`)).data;
        this.partesObtenidos = httpRequest('GET', encodeURI(`http://backend:8080/partes`)).data;
    });

Then('se obtiene la siguiente respuesta de correccion de partes',
    function (partesString) {
        let partesEsperados = JSON.parse(partesString).partesMO;

        for (let pmo of this.partesObtenidos) {
            delete pmo.id;
            pmo.fecha = pmo.fecha.substring(0, 10);
            delete pmo.horas;
            delete pmo.operario.id;
            delete pmo.operario.categoria;
            delete pmo.operario.turno;
            delete pmo.operario.fechaTurnoDesde;
            delete pmo.operario.fechaTurnoHasta;
            delete pmo.operario.horaDesde;
            delete pmo.operario.horaHasta;
            delete pmo.operario.historicoTurnos;
            delete pmo.proyecto.id;
            delete pmo.proyecto.empresa;
            delete pmo.proyecto.tareas;
            delete pmo.tarea.id;
            delete pmo.estado.id;
            if (pmo.estado.nombre !== 'inválido') {
                delete pmo.logsValidacion;
            }

            // Comprobación de si logsValidacion es un iterable
            if (Array.isArray(pmo.logsValidacion)) {
                if (pmo.logsValidacion) {
                    pmo.logsValidacion = pmo.logsValidacion.filter(log => {
                        if (log.estado.nombre == 'caducado') {
                            return false;
                        }
                        delete log.id;
                        delete log.estado.id;
                        delete log.validacionParteMO.id;
                        delete log.fecha;
                        delete log.tiempoCreacion;
                        return true;
                    });
                }
            }
        }

        this.partesObtenidos = this.partesObtenidos.filter(res => res.operario.legajo <= 6000 && res.operario.legajo >= 4000);

        for (let pmo of partesEsperados) {
            delete pmo.id;
            delete pmo.estado.id;
            delete pmo.operario.id;
            delete pmo.proyecto.id;
            delete pmo.tarea.id;

            // Comprobación de si logValidacion es un iterable
            if (Array.isArray(pmo.logsValidacion)) {
                for (let logs of pmo.logsValidacion) {
                    delete logs.id;
                    delete logs.estado.id;
                    delete logs.validacionParteMO.id;
                }
            } else {
                delete pmo.logValidacion;
            }
        }

        let partesEsperadosOrdenados = ordenar(partesEsperados);
        let partesObtenidosOrdenados = ordenar(this.partesObtenidos);

        assert.equal(partesObtenidosOrdenados, partesEsperadosOrdenados);
    });