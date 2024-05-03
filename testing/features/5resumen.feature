# language: es

Característica: resumen partes de Mano de obra
   resumen de la carga de partes de MO por día y operario

   Escenario: ver informe
   Dada los partes cargados
   Cuando se solicitan obtener el resumen de partes por día y operario 
   Entonces se obtiene el siguiente resumen
   """
      {
      "resumenPartesMO": [
         {"legajo": 1000,"nombre": "Hermenegildo Sabat","ingreso":"07:00","egreso":"15:00","horas":"08:00","horasPartes":"08:00"},
         {"legajo": 2000,"nombre": "Mariela Williams","ingreso":"07:00","egreso":"15:00","horas":"08:00","horasPartes":"08:00"},
         {"legajo": 3000,"nombre": "Pedro Almodobar","ingreso":"08:23","egreso":"13:00","horas":"04:37","horasPartes":"04:37"},
         {"legajo": 4000,"nombre": "Manuel Belgrano","ingreso":"15:00","egreso":"21:00","horas":"08:00","horasPartes":"07:50"},
         {"legajo": 5000,"nombre": "Soledad Solari","ingreso":"18:26","egreso":"21:00","horas":"02:34","horasPartes":"28:34"},
         {"legajo": 6000,"nombre": "Mariano Moreno","ingreso":"07:00","egreso":"15:00","horas":"08:00","horasPartes":"09:00"}
      ]
      }
   """