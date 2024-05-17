DELETE FROM proyecto_tareas;
--DELETE FROM historico_turno;
--DELETE FROM turno;
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
INSERT INTO estado (id, nombre, descripcion) VALUES (5,'corregido','Parte de Mano de Obra corregido');
INSERT INTO estado (id, nombre, descripcion) VALUES (10,'generado','log de validación generado');

--INSERT INTO turno (id, hora_desde, hora_hasta, nombre) VALUES(1, '07:00:00', '15:00:00', '7a15');
--INSERT INTO turno (id, hora_desde, hora_hasta, nombre) VALUES(2, '15:00:00', '21:00:00', '15a21');

INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(1,2,'incumple horario','El operario incumple el horario establecido en su turno');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(2,2,'superposición horaria','El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(3,2,'hueco horario','Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)');
INSERT INTO validacion_partemo (id, tipo, nombre, descripcion) VALUES(4,2,'fuera de turno','El operario no cumple el horario en su turno');

INSERT INTO categoria (id, nombre) VALUES (1,'Oficial Especializado');
INSERT INTO categoria (id, nombre) VALUES (2,'Oficial Albañil');
INSERT INTO categoria (id, nombre) VALUES (3,'Medio Oficial Albañil');
INSERT INTO categoria (id, nombre) VALUES (4,'Oficial Carpintero');
INSERT INTO categoria (id, nombre) VALUES (5,'Oficial Armador');
INSERT INTO categoria (id, nombre) VALUES (6,'Medio Oficial Armador');
INSERT INTO categoria (id, nombre) VALUES (7,'Ayudante');

INSERT INTO operario (id, categoria, fecha_turno_desde, fecha_turno_hasta, hora_desde, hora_hasta, legajo, nombre, turno) VALUES(1, 'Oficial Albañil', '2024-05-12', null, '15:00:00', '21:00:00', 1974, 'Eric', '15a21');
INSERT INTO operario (id, categoria, fecha_turno_desde, fecha_turno_hasta, hora_desde, hora_hasta, legajo, nombre, turno) VALUES(2, 'Oficial Armador', '2024-05-12', null, '07:00:00', '15:00:00', 1975, 'Pedro', '7a15');
INSERT INTO operario (id, categoria, fecha_turno_desde, fecha_turno_hasta, hora_desde, hora_hasta, legajo, nombre, turno) VALUES(3, 'Medio Oficial Armador', '2024-05-12', null, '15:00:00', '21:00:00', 1976, 'Pepe', '15a21');
INSERT INTO operario (id, categoria, fecha_turno_desde, fecha_turno_hasta, hora_desde, hora_hasta, legajo, nombre, turno) VALUES(4, 'Ayudante', '2024-05-12', null, '07:00:00', '15:00:00', 1977, 'Raul', '7a15');