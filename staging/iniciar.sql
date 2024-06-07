DELETE FROM proyecto_tareas;
DELETE FROM operario_historico_turnos;
DELETE FROM tipo_turno_horarios;
DELETE FROM historico_turno;
DELETE FROM tipo_turno;
DELETE FROM horario;
DELETE FROM partemo_logs_validacion;
DELETE FROM log_validacion_partemo;
DELETE FROM validacion_partemo;
DELETE FROM partemo;
DELETE FROM estado;
DELETE FROM categoria;
DELETE FROM operario;
DELETE FROM tarea;
DELETE FROM proyecto;
DELETE FROM empresa;

INSERT INTO estado (id, nombre, descripcion) VALUES (1, 'generado', 'Parte de Mano de Obra generado');
INSERT INTO estado (id, nombre, descripcion) VALUES (2, 'válido', 'Parte de Mano de Obra válido');
INSERT INTO estado (id, nombre, descripcion) VALUES (3, 'inválido', 'Parte de Mano de Obra inválido');
INSERT INTO estado (id, nombre, descripcion) VALUES (4,'validado','Parte de Mano de Obra validado por supervisor');
INSERT INTO estado (id, nombre, descripcion) VALUES (5,'corregido','Parte de Mano de Obra corregido');
INSERT INTO estado (id, nombre, descripcion) VALUES (6,'rechazado','Parte de Mano de Obra rechazado por supervisor');
INSERT INTO estado (id, nombre, descripcion) VALUES (7,'anulado','Parte de Mano de Obra anulado');
INSERT INTO estado (id, nombre, descripcion) VALUES (10,'generado','log de validación generado');
INSERT INTO estado (id, nombre, descripcion) VALUES (11,'caducado','log de validación caducado');

INSERT INTO tipo_turno (id, dias_franco, dias_trabajo, fecha_arranque, nombre, tipo) VALUES(1, 2, 5, '2003-01-01', 'Fijo MAÑANA 5X2', 'Fijo');
INSERT INTO horario (id, hora_desde, hora_hasta, orden) VALUES(1, '07:00:00', '15:00:00', 0); --Fijo mañana
INSERT INTO tipo_turno_horarios (tipo_turno_id, horarios_id) VALUES(1, 1);

INSERT INTO tipo_turno (id, dias_franco, dias_trabajo, fecha_arranque, nombre, tipo) VALUES(2, 2, 5, '2003-01-01', 'Fijo TARDE 5X2', 'Fijo');
INSERT INTO horario (id, hora_desde, hora_hasta, orden) VALUES(2, '15:00:00', '21:00:00', 0); --Fijo tarde
INSERT INTO tipo_turno_horarios (tipo_turno_id, horarios_id) VALUES(2, 2);

INSERT INTO tipo_turno (id, dias_franco, dias_trabajo, fecha_arranque, nombre, tipo) VALUES(3, 2, 6, '2020-06-10', 'Rotativo 6x2 M-T', 'Rotativo');
INSERT INTO horario (id, hora_desde, hora_hasta, orden) VALUES(3, '07:00:00', '15:00:00', 0); --Rotativo 6x2 M-T 
INSERT INTO horario (id, hora_desde, hora_hasta, orden) VALUES(4, '15:00:00', '21:00:00', 1); --Rotativo 6x2 M-T
INSERT INTO tipo_turno_horarios (tipo_turno_id, horarios_id) VALUES(3, 3);
INSERT INTO tipo_turno_horarios (tipo_turno_id, horarios_id) VALUES(3, 4);

INSERT INTO tipo_turno (id, dias_franco, dias_trabajo, fecha_arranque, nombre, tipo) VALUES(4, 2, 6, '2020-06-10', 'Rotativo 6x2 T-M', 'Rotativo');
INSERT INTO horario (id, hora_desde, hora_hasta, orden) VALUES(5, '15:00:00', '21:00:00', 0); --Rotativo 6x2 T-M
INSERT INTO horario (id, hora_desde, hora_hasta, orden) VALUES(6, '07:00:00', '15:00:00', 1); --Rotativo 6x2 T-M 
INSERT INTO tipo_turno_horarios (tipo_turno_id, horarios_id) VALUES(4, 5);
INSERT INTO tipo_turno_horarios (tipo_turno_id, horarios_id) VALUES(4, 6);

INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(1,2,'incumple horario','El operario incumple el horario establecido en su turno');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(2,2,'superposición horaria','El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(3,2,'hueco horario','Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(4,2,'fuera de turno','El operario no cumple el horario en su turno');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(5,0,'válido','Este parte es válido');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(6,0,'validado','Este parte está validado por un supervisor');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(7,0,'rechazado','Este parte fue rechazado por un supervisor');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(8,0,'Está de franco','Este operario esta de franco!');

INSERT INTO categoria (id, nombre) VALUES (1,'Oficial Especializado');
INSERT INTO categoria (id, nombre) VALUES (2,'Oficial Albañil');
INSERT INTO categoria (id, nombre) VALUES (3,'Medio Oficial Albañil');
INSERT INTO categoria (id, nombre) VALUES (4,'Oficial Carpintero');
INSERT INTO categoria (id, nombre) VALUES (5,'Oficial Armador');
INSERT INTO categoria (id, nombre) VALUES (6,'Medio Oficial Armador');
INSERT INTO categoria (id, nombre) VALUES (7,'Ayudante');