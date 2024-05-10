# language: es

Característica: Validar partes de mano de obra
   Gestión de control, validación, revisión y login de partes de mano de obra
   
   Escenario: valida partes de MO en estados generado y/o corregido
   Dado el siguiente listado de partes de mano de obra en estado a validar
   """
{
   "partesMO": [
      {"id":1,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"07:00:00","horaHasta":"10:56:00","operario":{"id":1000,"legajo":1000,"nombre":"Hermenegildo Sabat"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}},
      {"id":2,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2020-05-12","horaDesde":"10:56:00","horaHasta":"13:00:00","operario":{"id":1000,"legajo":1000,"nombre":"Hermenegildo Sabat"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}},
      {"id":3,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2020-05-12","horaDesde":"13:00:00","horaHasta":"15:00:00","operario":{"id":1000,"legajo":1000,"nombre":"Hermenegildo Sabat"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1003","descripcion":"limpieza"}},
      {"id":4,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2020-05-12","horaDesde":"07:00:00","horaHasta":"10:56:00","operario":{"id":2000,"legajo":2000,"nombre":"Mariela Williams"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}},
      {"id":5,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2020-05-12","horaDesde":"10:56:00","horaHasta":"13:00:00","operario":{"id":2000,"legajo":2000,"nombre":"Mariela Williams"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}},
      {"id":6,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2020-05-12","horaDesde":"13:00:00","horaHasta":"15:00:00","operario":{"id":2000,"legajo":2000,"nombre":"Mariela Williams"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1002","descripcion":"plegadora perfiles"}},
      {"id":7,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"08:23:00","horaHasta":"10:56:00","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}},
      {"id":8,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"10:56:00","horaHasta":"13:00:00","operario":{"id":3000,"legajo":3000,"nombre":"Pedro Almodovar"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}},
      {"id":9,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:26:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2004,"codigo":"2004","descripcion":"Limpieza sector montaje"}},
      {"id":10,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"17:56:00","horaHasta":"19:50:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":2000,"codigo":"2000","descripcion":"Montaje galpón norte"},"tarea":{"id":2010,"codigo":"2010","descripcion":"encofrado"}},
      {"id":11,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"18:00:00","horaHasta":"21:00:00","operario":{"id":4000,"legajo":4000,"nombre":"Manuel Belgrano"},"proyecto":{"id":3000,"codigo":"3000","descripcion":"Construcción vereda sur"},"tarea":{"id":3002,"codigo":"3002","descripcion":"hormigonado"}},
      {"id":12,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"15:00:00","horaHasta":"17:26:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4004,"codigo":"4004","descripcion":"Limpieza sector granallado"}},
      {"id":13,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"18:26:00","horaHasta":"19:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4010,"codigo":"4010","descripcion":"preparación"}},
      {"id":14,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"20:00:00","horaHasta":"21:00:00","operario":{"id":5000,"legajo":5000,"nombre":"Soledad Solari"},"proyecto":{"id":4000,"codigo":"4000","descripcion":"Granallado edificio municipal"},"tarea":{"id":4002,"codigo":"4002","descripcion":"granallado"}},
      {"id":15,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"07:00:00","horaHasta":"11:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1001,"codigo":"1001","descripcion":"corte chapa pantógrafo"}},
      {"id":16,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"10:00:00","horaHasta":"14:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1002,"codigo":"1002","descripcion":"plegadora perfiles"}},
      {"id":17,"estado":{"id":1,"nombre":"generado","descripcion":"Parte de Mano de Obra generado"},"fecha":"2023-05-12","horaDesde":"13:00:00","horaHasta":"15:00:00","operario":{"id":6000,"legajo":6000,"nombre":"Mariano Moreno"},"proyecto":{"id":1000,"codigo":"1000","descripcion":"Escalera lateral fundición"},"tarea":{"id":1003,"codigo":"1003","descripcion":"limpieza"}}
   ]
}
   """

   Cuando se solicita validar los partes a la fecha "2023-05-13"
   Entonces se obtiene la siguiente respuesta
   """
   {
      partesMO: [
         {'id':1,'estado':{'id':2,'nombre':'válido','descripcion':'Parte de Mano de Obra válido'},'fecha':'2023-05-12','horaDesde':'7:00','horaHasta':'10:55','operario':{'id':1000,'legajo':1000,'nombre':'Hermenegildo Sabat'},'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1001,'nombre':'1001','descripcion':'corte chapa pantografo'}},
         {'id':2,'estado':{'id':2,'nombre':'válido','descripcion':'Parte de Mano de Obra válido'},'fecha':'2023-05-12','horaDesde':'10:56','horaHasta':'13:00','operario':{'id':1000,'legajo':1000,'nombre':'Hermenegildo Sabat'}'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1002,'nombre':'1002','descripcion':'plegadora perfiles'}},
         {'id':3,'estado':{'id':2,'nombre':'válido','descripcion':'Parte de Mano de Obra válido'},'fecha':'2023-05-12','horaDesde':'13:00','horaHasta':'15:00','operario':{'id':1000,'legajo':1000,'nombre':'Hermenegildo Sabat'}'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1003,'nombre':'1003','descripcion':'limpieza'}},
         {'id':4,'estado':{'id':2,'nombre':'válido','descripcion':'Parte de Mano de Obra válido'},'fecha':'2023-05-12','horaDesde':'7:00','horaHasta':'10:55','operario':{'id':2000,'legajo':2000,'nombre':'Mariela Williams'}   'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1001,'nombre':'1001','descripcion':'corte chapa pantografo'}},
         {'id':5,'estado':{'id':2,'nombre':'válido','descripcion':'Parte de Mano de Obra válido'},'fecha':'2023-05-12','horaDesde':'10:56','horaHasta':'13:00','operario':{'id':2000,'legajo':2000,'nombre':'Mariela Williams'}  'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1002,'nombre':'1002','descripcion':'plegadora perfiles'}},       
         {'id':6,'estado':{'id':2,'nombre':'válido','descripcion':'Parte de Mano de Obra válido'},'fecha':'2023-05-12','horaDesde':'13:00','horaHasta':'15:00','operario':{'id':2000,'legajo':2000,'nombre':'Mariela Williams'}  'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1003,'nombre':'1003','descripcion':'limpieza'}},
         {'id':7,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'8:23','horaHasta':'10:55','operario':{'id':3000,'legajo':3000,'nombre':'Pedro Almodovar'}'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1001,'nombre':'1001','descripcion':'corte chapa pantografo'}},
            'logValidacionParteMO':[
               {'id':1,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':1,'tipo':'ERROR','nombre':'incumple horario','descripción':'El operario incumple el horario establecido en su turno'}}
            ]},
         {'id':8,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'10:56','horaHasta':'13:00','operario':{'id':3000,'legajo':3000,'nombre':'Pedro Almodovar'},'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral fundición'},'tarea':{'id':1002,'nombre':'1001','descripcion':'plegadora perfiles'},
            'logValidacionParteMO':[
               {'id':2,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':1,'tipo':'ERROR','nombre':'incumple horario','descripción':'El operario incumple el horario establecido en su turno'}}
            ]
         },
         {'id':9,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'15:00','horaHasta':'17:25','operario':{'id':4000,'legajo':4000,'nombre':'Manuel Belgrano'},'proyecto':{'id':2000,'nombre':'2000','descripcion':'Montaje galpón norte'},'tarea':{'id':2004,'nombre':'2004','descripcion':'Limpieza sector montaje'},
            'logValidacionParteMO':[
               {'id':3,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':2,'tipo':'ERROR','nombre':'superposición horaria','descripción':'El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)'}}
            ]
         },
         {'id':10,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'17:00','horaHasta':'19:00','operario':{'id':4000,'legajo':4000,'nombre':'Manuel Belgrano'},'proyecto':{'id':2000,'nombre':'2000','descripcion':'Montaje galpón norte'},'tarea':{'id':2010,'nombre':'2010','descripcion':'encofrado'},
            'logValidacionParteMO':[
               {'id':4,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':2,'tipo':'ERROR','nombre':'superposición horaria','descripción':'El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)'}}
            ]
         },
         {'id':11,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'18:00','horaHasta':'21:00','operario':{'id':4000,'legajo':4000,'nombre':'Manuel Belgrano'},'proyecto':{'id':3000,'nombre':'3000','descripcion':'Construcción vereda sur'},'tarea':{'id':3002,'nombre':'3002','descripcion':'hormigonado'},
            'logValidacionParteMO':[
               {'id':5,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':2,'tipo':'ERROR','nombre':'superposición horaria','descripción':'El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)'}}
            ]
         },
         {'id':12,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'15:00','horaHasta':'17:25','operario':{'id':5000,'legajo':5000,'nombre':'Soledad Solari'},'proyecto':{'id':4000,'nombre':'4000','descripcion':'Granallado edificio municipal'},'tarea':{'id':4004,'nombre':'4004','descripcion':'Limpieza sector granallado'},
            'logValidacionParteMO':[
               {'id':6,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':3,'tipo':'ERROR','nombre':'hueco horario','descripción':'Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)'}}
            ]
         },
         {'id':13,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'18:26','horaHasta':'19:00','operario':{'id':5000,'legajo':5000,'nombre':'Soledad Solari'},'proyecto':{'id':4000,'nombre':'4000','descripcion':'Granallado edificio municipal'},'tarea':{'id':4010,'nombre':'4010','descripcion':'preparación'},
            'logValidacionParteMO':[
               {'id':7,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':3,'tipo':'ERROR','nombre':'hueco horario','descripción':'Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)'}}
            ]
         },
         {'id':14,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'20:00','horaHasta':'21:00','operario':{'id':5000,'legajo':5000,'nombre':'Soledad Solari'},'proyecto':{'id':4000,'nombre':'4000','descripcion':'Granallado edificio municipal'},'tarea':{'id':4002,'nombre':'4002','descripcion':'granallado'},
            'logValidacionParteMO':[
               {'id':8,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':3,'tipo':'ERROR','nombre':'hueco horario','descripción':'Existen huecos horarios entre tareas del mismo día (-horas que entrada-salida)'}}
            ]
         },
         {'id':15,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'07:00','horaHasta':'11:00','operario':{'id':6000,'legajo':6000,'nombre':'Mariano Moreno'},proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral dundición'},'tarea':{'id':1001,'nombre':'1001','descripcion':'corte chapa pantografo'},
            'logValidacionParteMO':[
               {'id':9,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':2,'tipo':'ERROR','nombre':'superposición horaria','descripción':'El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)'}},
               {'id':10,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':4,'tipo':'ERROR','nombre':'fuera de turno','descripción':'El operario no cumple el horario en su turno'}}
            ]
         },
         {'id':16,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'10:00','horaHasta':'14:00','operario':{'id':6000,'legajo':6000,'nombre':'Mariano Moreno'},'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral dundición'},'tarea':{'id':1002,'nombre':'1002','descripcion':'plegadora perfiles'},
            'logValidacionParteMO':[
               {'id':11,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':2,'tipo':'ERROR','nombre':'superposición horaria','descripción':'El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)'}},
               {'id':12,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':4,'tipo':'ERROR','nombre':'fuera de turno','descripción':'El operario no cumple el horario en su turno'}}
            ]
         },
         {'id':17,'estado':{'id':3,'nombre':'inválido','descripcion':'Parte de Mano de Obra inválido'},'fecha':'2023-05-12','horaDesde':'13:00','horaHasta':'15:00','operario':{'id':6000,'legajo':6000,'nombre':'Mariano Moreno'},'proyecto':{'id':1000,'nombre':'1000','descripcion':'Escalera lateral dundición'},'tarea':{'id':1003,'nombre':'1003','descripcion':'limpieza'},
            'logValidacionParteMO':[
               {'id':13'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':2,'tipo':'ERROR','nombre':'superposición horaria','descripción':'El operario superpone horas entre tareas del mismo día (+horas que entrada-salida)'}},
               {'id':14,'estado':{'id':10,'nombre':'generado','descripcion':'log de validación generado'},'validacionParteMO';{'id':4,'tipo':'ERROR','nombre':'fuera de turno','descripción':'El operario no cumple el horario en su turno'}}
            ]
         }
      ]
   }
   """