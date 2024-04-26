# language: es

Característica: gestión de empresas

   Esquema del escenario: Nueva Empresa (cliente) que encargan proyectos
      Dado que se ingresa el cliente con "<nombre>", "<cuit>" y "<observaciones>"
      Cuando presiono el botón de guardar
      Entonces se espera la siguiente "<respuesta>"

      Ejemplos:
      | nombre          | cuit     | observaciones          | respuesta               |
      | Matriz Hierros  | 10100100 | Empresa Metal-mecánica | Cliente Matriz Hierros con cuit 10100100 cargado correctamente  |
      | Delivery        | 20200200 |                        | Cliente Delivery con cuit 20200200 cargado correctamente  |
      | Golfo Nuevo     | 30300300 | Empresa pesquera       | Cliente Golfo Nuevo con cuit 30300300 cargado correctamente  |
      | Marta Ríos      | 40400400 |                        | Cliente Marta Ríos con cuit 40400400 cargado correctamente  |
      | Martín Quintana | 50500500 | Particular             | Cliente Martín Quintana con cuit 50500500 cargado correctamente  |
