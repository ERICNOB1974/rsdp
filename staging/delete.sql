DELETE FROM proyecto_tareas;
DELETE FROM partemo;
DELETE FROM estado;
DELETE FROM operario;
DELETE FROM tarea;
DELETE FROM proyecto;
DELETE FROM empresa;

INSERT INTO estado (id, nombre, descripcion) VALUES (1, 'generado', 'Parte de Mano de Obra generado');
INSERT INTO estado (id, nombre, descripcion) VALUES (2, 'válido', 'Parte de Mano de Obra válido');
INSERT INTO estado (id, nombre, descripcion) VALUES (3, 'inválido', 'Parte de Mano de Obra inválido');