# language: es

Característica: corregir y revalidar partes de mano de obra
   Gestión de control, validación, revisión y login de partes de mano de obra

Esquema del escenario: verificación de partes inválidos
   Dado el parte "<parteMO>" que está inválido
   Cuando se corrige el "<parteMOCorregido>" 
   Entonces se espera el siguiente resultado de correccion de partes "<resultadoEsperado>"
   
   Ejemplos:
   | parteMO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | parteMOCorregido                                                                                                                                                                                                                                                                                                                                                                                                |resultadoEsperado                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | '{"id":7,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"08:23:00","horaHasta":"10:56:00","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"},"logValidacionParteMO":[{"id":1,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":1,"tipo":"ERROR","nombre":"incumple horario","descripcion":"El operario incumple el horario establecido en su turno"}}]}'                                                                                                                                                                                                                                                                  | '{"id":7,"estado":{"id":4,"nombre":"validado","descripcion":"Parte de Mano de Obra validado por supervisor"},"fecha":"2023-05-12","horaDesde":"08:23:00","horaHasta":"10:56:00","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}}'  |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":7,"estado":{"id":4,"nombre":"validado","descripcion":"Parte de Mano de Obra validado por supervisor"},"fecha":"2023-05-12","horaDesde":"08:23","horaHasta":"10:56","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}}}'   |
   | '{"id":8,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"10:56:00","horaHasta":"13:00:00","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"},"logValidacionParteMO":[{"id":2,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":1,"tipo":"ERROR","nombre":"incumple horario","descripcion":"El operario incumple el horario establecido en su turno"}}]}'                                                                                                                                                                                                                                                                      | '{"id":8,"estado":{"id":4,"nombre":"validado","descripcion":"Parte de Mano de Obra validado por supervisor"},"fecha":"2023-05-12","horaDesde":"10:56:00","horaHasta":"13:00:00","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}}'      |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":8,"estado":{"id":4,"nombre":"validado","descripcion":"Parte de Mano de Obra validado por supervisor"},"fecha":"2023-05-12","horaDesde":"10:56","horaHasta":"13:00","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}}}'       |
   | '{"id":9,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:26:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2004,"codigo":"2004","descripcion":"Limpieza sector montaje"},"logValidacionParteMO":[{"id":3,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":2,"tipo":"ERROR","nombre":"superposición horaria","descripcion":"El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)"}}]}'                                                                                                                                                                                                                                       | '{"id":9,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2004,"codigo":"2004","descripcion":"Limpieza sector montaje"}}'                    |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":9,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"15:00","horaHasta":"17:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2004,"codigo":"2004","descripcion":"Limpieza sector montaje"}}}'                     |
   | '{"id":10,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"17:00:00","horaHasta":"19:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2010,"codigo":"2010","descripcion":"encofrado"},"logValidacionParteMO":[{"id":4,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":2,"tipo":"ERROR","nombre":"superposición horaria","descripcion":"El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)"}}]}'                                                                                                                                                                                                                                                    | '{"id":10,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"17:00:00","horaHasta":"19:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2010,"codigo":"2010","descripcion":"encofrado"}}'                                 |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":10,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"17:00","horaHasta":"19:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2010,"codigo":"2010","descripcion":"encofrado"}}}'                                  |
   | '{"id":11,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"18:00:00","horaHasta":"21:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":3000,"codigo":"3000","descripcion":"Construcción vereda sur"},"tarea":{"id":3002,"codigo":"3002","descripcion":"hormigonado"},"logValidacionParteMO":[{"id":5,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":2,"tipo":"ERROR","nombre":"superposición horaria","descripcion":"El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)"}}]}'                                                                                                                                                                                                                                               | '{"id":11,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"19:00:00","horaHasta":"21:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":3000,"codigo":"3000","descripcion":"Construcción vereda sur"},"tarea":{"id":3002,"codigo":"3002","descripcion":"Hormigonado"}}'                            |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":11,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"19:00","horaHasta":"21:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":3000,"codigo":"3000","descripcion":"Construcción vereda sur"},"tarea":{"id":3002,"codigo":"3002","descripcion":"hormigonado"}}}'                             |
   | '{"id":12,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:26:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4004,"codigo":"4004","descripcion":"Limpieza sector granallado"},"logValidacionParteMO":[{"id":6,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":3,"tipo":"ERROR","nombre":"hueco horario","descripcion":"Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)"}}]}'                                                                                                                                                                                                                                       | '{"id":12,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:26:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4004,"codigo":"4004","descripcion":"Limpieza sector granallado"}}'        |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":12,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"15:00","horaHasta":"17:26","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4004,"codigo":"4004","descripcion":"Limpieza sector granallado"}}}'         |
   | '{"id":13,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"18:26:00","horaHasta":"19:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4010,"codigo":"4010","descripcion":"preparación"},"logValidacionParteMO":[{"id":7,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":3,"tipo":"ERROR","nombre":"hueco horario","descripcion":"Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)"}}]}'                                                                                                                                                                                                                                                      | '{"id":13,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"17:26:00","horaHasta":"18:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4010,"codigo":"4010","descripcion":"preparación"}}'                       |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":13,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"17:26","horaHasta":"18:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4010,"codigo":"4010","descripcion":"preparación"}}}'                        |
   | '{"id":14,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"20:00:00","horaHasta":"21:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4002,"codigo":"4002","descripcion":"granallado"},"logValidacionParteMO":[{"id":8,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":3,"tipo":"ERROR","nombre":"hueco horario","descripcion":"Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)"}}]}'                                                                                                                                                                                                                                                       | '{"id":14,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"18:00:00","horaHasta":"21:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4002,"codigo":"4002","descripcion":"granallado"}}'                        |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":14,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"18:00","horaHasta":"21:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4002,"codigo":"4002","descripcion":"granallado"}}}'                         |
   | '{"id":15,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"07:00:00","horaHasta":"11:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"},"logValidacionParteMO":[{"id":9,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":2,"tipo":"ERROR","nombre":"superposición horaria","descripcion":"El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)"}},{"id":10,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":4,"tipo":"ERROR","nombre":"fuera de turno","descripcion":"El operario no cumple el horario en su turno"}}]}'   | '{"id":15,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"07:00:00","horaHasta":"11:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}}'               |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":15,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"07:00","horaHasta":"11:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}}}'                | 
   | '{"id":16,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"10:00:00","horaHasta":"14:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"},"logValidacionParteMO":[{"id":11,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":2,"tipo":"ERROR","nombre":"superposición horaria","descripcion":"El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)"}},{"id":12,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":4,"tipo":"ERROR","nombre":"fuera de turno","descripcion":"El operario no cumple el horario en su turno"}}]}'      | '{"id":16,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"11:00:00","horaHasta":"13:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}}'                   |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":16,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"11:00","horaHasta":"13:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}}}'                    |
   | '{"id":17,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"13:00:00","horaHasta":"15:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1003","descripcion":"limpieza"},"logValidacionParteMO":[{"id":11,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":2,"tipo":"ERROR","nombre":"superposición horaria","descripcion":"El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)"}},{"id":12,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":4,"tipo":"ERROR","nombre":"fuera de turno","descripcion":"El operario no cumple el horario en su turno"}}]}'                | '{"id":17,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"13:00:00","horaHasta":"15:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1003","descripcion":"limpieza"}}'                             |'{"StatusCode": 200, "StatusText": "Parte MO alterado correctamente","data":{"id":17,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"13:00","horaHasta":"15:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1003","descripcion":"limpieza"}}}'                              |

   Escenario: valida partes de MO en estados generado y/o corregido
   Dado el siguiente listado de partes de mano de obra en estado a validar para la correccion
   """
   {
      "partesMO": [
         {"id":9,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"sector":{"id": 2,"nombre": "taller2"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2004,"codigo":"2004","descripcion":"Limpieza sector montaje"}},                  
         {"id":10,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"17:00:00","horaHasta":"19:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"sector":{"id": 2,"nombre": "taller2"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2010,"codigo":"2010","descripcion":"encofrado"}},                    
         {"id":11,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"19:00:00","horaHasta":"21:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"sector":{"id": 3,"nombre": "taller5"},"proyecto":{"id":3000,"codigo":"3000","descripcion":"Construcción vereda sur"},"tarea":{"id":3002,"codigo":"3002","descripcion":"hormigonado"}},                          
         {"id":12,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:26:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"sector":{"id": 4,"nombre": "taller3"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4004,"codigo":"4004","descripcion":"Limpieza sector granallado"}},      
         {"id":13,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"17:26:00","horaHasta":"18:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"sector":{"id": 4,"nombre": "taller3"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4010,"codigo":"4010","descripcion":"preparación"}},       
         {"id":14,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"18:00:00","horaHasta":"21:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"sector":{"id": 4,"nombre": "taller3"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4002,"codigo":"4002","descripcion":"granallado"}},                      
         {"id":15,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"07:00:00","horaHasta":"11:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"sector":{"id": 1,"nombre": "taller1"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}},             
         {"id":16,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"11:00:00","horaHasta":"13:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"sector":{"id": 1,"nombre": "taller1"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}},              
         {"id":17,"estado":{"id":5,"nombre":"corregido","descripcion":"Parte de Mano de Obra corregido"},"fecha":"2023-05-12","horaDesde":"13:00:00","horaHasta":"15:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"sector":{"id": 1,"nombre": "taller1"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1003","descripcion":"limpieza"}}                          
      ]
   }
   """
   Cuando se solicita validar los partes a la fecha "2023-05-13" para la correccion
   Entonces se obtiene la siguiente respuesta de correccion de partes
   """
   {
      "partesMO": [
         {"id":9, "estado":{"id":2,"nombre":"válido","descripcion":"Parte de Mano de Obra válido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2004,"codigo":"2004","descripcion":"Limpieza sector montaje"}},                
         {"id":10,"estado":{"id":2,"nombre":"válido","descripcion":"Parte de Mano de Obra válido"},"fecha":"2023-05-12","horaDesde":"17:00:00","horaHasta":"19:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2010,"codigo":"2010","descripcion":"encofrado"}},                  
         {"id":11,"estado":{"id":2,"nombre":"válido","descripcion":"Parte de Mano de Obra válido"},"fecha":"2023-05-12","horaDesde":"19:00:00","horaHasta":"21:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":3000,"codigo":"3000","descripcion":"Construcción vereda sur"},"tarea":{"id":3002,"codigo":"3002","descripcion":"hormigonado"}},                          
         {"id":12,"estado":{"id":2,"nombre":"válido","descripcion":"Parte de Mano de Obra válido"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:26:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4004,"codigo":"4004","descripcion":"Limpieza sector granallado"}},      
         {"id":13,"estado":{"id":2,"nombre":"válido","descripcion":"Parte de Mano de Obra válido"},"fecha":"2023-05-12","horaDesde":"17:26:00","horaHasta":"18:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4010,"codigo":"4010","descripcion":"preparación"}},       
         {"id":14,"estado":{"id":2,"nombre":"válido","descripcion":"Parte de Mano de Obra válido"},"fecha":"2023-05-12","horaDesde":"18:00:00","horaHasta":"21:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4002,"codigo":"4002","descripcion":"granallado"}},                      
         {"id":15,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"07:00:00","horaHasta":"11:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"},             
            "logsValidacion":[
               {"id":15,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":4,"tipo":"ERROR","nombre":"fuera de turno","descripcion":"El operario no cumple el horario en su turno"}}
            ]
         },
         {"id":16,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"11:00:00","horaHasta":"13:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"},
            "logsValidacion":[
               {"id":16,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":4,"tipo":"ERROR","nombre":"fuera de turno","descripcion":"El operario no cumple el horario en su turno"}}
            ]
         },
         {"id":17,"estado":{"id":3,"nombre":"inválido","descripcion":"Parte de Mano de Obra inválido"},"fecha":"2023-05-12","horaDesde":"13:00:00","horaHasta":"15:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1003","descripcion":"limpieza"},
            "logsValidacion":[
               {"id":17,"estado":{"id":10,"nombre":"generado","descripcion":"log de validación generado"},"validacionParteMO":{"id":4,"tipo":"ERROR","nombre":"fuera de turno","descripcion":"El operario no cumple el horario en su turno"}}
            ]
         }
      ]
   }
   """