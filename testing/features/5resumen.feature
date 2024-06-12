# language: es

Característica: resumen partes de Mano de obra
   resumen de la carga de partes de MO por día y operario

   Escenario: ver informe
   Dada los partes cargados
   Cuando se solicitan obtener el resumen de partes por día y operario 
   Entonces se obtiene el siguiente resumen
   """
      {
      "resumenPartesMO": 
         [
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":1000,"nombre":"Hermenegildo Sabat"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":2000,"nombre":"Mariela Williams"},
            {"egreso":"13:00:00","horas":"04:37:00","horasPartes":"04:37:00","ingreso":"08:23:00","legajo":3000,"nombre":"Pedro Almodovar"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"07:20:00","ingreso":"15:00:00","legajo":4000,"nombre":"Manuel Belgrano"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"04:00:00","ingreso":"15:00:00","legajo":5000,"nombre":"Soledad Solari"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"10:00:00","ingreso":"07:00:00","legajo":6000,"nombre":"Mariano Moreno"},
            {"egreso":"19:30:00","horas":"12:00:00","horasPartes":"10:00:00","ingreso":"07:30:00","legajo":7000,"nombre":"Evelyn Kovacs"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":8000,"nombre":"Pepe Sanchez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":9000,"nombre":"Santiago Segura"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":10000,"nombre":"Carla Giraldo"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":11000,"nombre":"Javier Perez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":12000,"nombre":"Ana Belen"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":13000,"nombre":"Daniel Lopez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":14000,"nombre":"Laura Rodriguez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":15000,"nombre":"Patricia Fernandez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":16000,"nombre":"Antonio Sanchez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":17000,"nombre":"Monica Diaz"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":18000,"nombre":"Pablo Ruiz"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":19000,"nombre":"Andrea Perez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":20000,"nombre":"Maria Gonzalez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":21000,"nombre":"Luisa Martinez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":22000,"nombre":"Juan Rodriguez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":23000,"nombre":"Carolina Lopez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":24000,"nombre":"Sergio Fernandez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":25000,"nombre":"Rosa Diaz"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":26000,"nombre":"David Gomez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":27000,"nombre":"Elena Sanchez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":28000,"nombre":"Carlos Rodriguez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":29000,"nombre":"Sonia Fernandez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":30000,"nombre":"Oscar Lopez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":31000,"nombre":"Cristina Diaz"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":32000,"nombre":"Patricia Garcia"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":33000,"nombre":"Marta Rodriguez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":34000,"nombre":"Juan Perez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":35000,"nombre":"Maria Lopez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"07:00:00","ingreso":"07:00:00","legajo":36000,"nombre":"Carlos Gomez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"09:00:00","ingreso":"07:00:00","legajo":37000,"nombre":"Laura Martinez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":38000,"nombre":"Jorge Rodriguez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":39000,"nombre":"Ana Fernandez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":40000,"nombre":"Luis Garcia"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":41000,"nombre":"Marta Lopez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":42000,"nombre":"Jose Martinez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":43000,"nombre":"Diego Perez"},
            {"egreso":"19:00:00","horas":"04:00:00","horasPartes":"04:00:00","ingreso":"15:00:00","legajo":44000,"nombre":"Lucia Rodriguez"},
            {"egreso":"15:00:00","horas":"08:00:00","horasPartes":"08:00:00","ingreso":"07:00:00","legajo":45000,"nombre":"Pablo Sanchez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":46000,"nombre":"Sara Lopez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":47000,"nombre":"Hugo Fernandez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":48000,"nombre":"Diego Garcia"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":49000,"nombre":"Clara Martinez"},
            {"egreso":"21:00:00","horas":"06:00:00","horasPartes":"06:00:00","ingreso":"15:00:00","legajo":50000,"nombre":"Ruben Rodriguez"}
         ]
      }
   """