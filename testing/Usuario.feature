# language: es

Característica: gestión de clientes

Esquema del escenario: Nuevo cliente que encargan pedidos de fabricación de productos
Dado que se ingresa el cliente con "<razonSocial>" y "<cuit>"
Cuando presiono el botón de guardar
Entonces se espera el siguiente <status> con la "<respuesta>"

Ejemplos:
| razonSocial                | cuit       | status | respuesta                                                                |
| prilidiano pueyrredon      | 10000000001 | 200    | Cliente prilidiano pueyrredon con cuit 10000000001 registrado correctamente      |
| marcelo t. de alvear       | 20000000002 | 200    | Cliente marcelo t. de alvear con cuit 20000000002 registrado correctamente       |
| domingo faustino sarmiento | 30000000003 | 200    | Cliente domingo faustino sarmiento con cuit 30000000003 registrado correctamente |
| walter runciman            | 40000000004 | 200    | Cliente walter runciman con cuit 40000000004 registrado correctamente            |
| julio argentino roca       | 50000000005 | 200    | Cliente julio argentino roca con cuit 50000000005 registrado correctamente       |
