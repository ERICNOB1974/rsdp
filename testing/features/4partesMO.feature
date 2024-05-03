# language: es

Característica: Cargar partes de Mano de obra
   Gestionar la carga de partes de MO considerando distintos escenarios y contextos

   Esquema del escenario: 
   Dado el operario con legajo <legajo> y nombre "<nombre>" que trabaja en el turno "<turno>" desde "<fechaTurnoDesde>"
   Y que trabajó el día "<fechaParte>" para el proyecto "<proyecto>" en la tarea "<tarea>" desde las "<horaDesde>" horas hasta las "<horaHasta>" horas
   Cuando se solicitan generar el parte
   Entonces se obtiente <statusCode> con "<statusText>"

   Ejemplos:
   | legajo | nombre             | turno | fechaTurnoDesde | fechaParte | proyecto | tarea | horaDesde | horaHasta | statusCode | statusText |
   | 1000   | Hermenegildo Sabat | 7a15  | 2015-05-01      | 2023-05-12 | 1000     | 1001  | 07:00     | 10:56     | 200 | Parte MO generado correctamente |
   | 1000   | Hermenegildo Sabat | 7a15  | 2015-05-01      | 2020-05-12 | 1000     | 1002  | 10:56     | 13:00     | 200 | Parte MO generado correctamente |
   | 1000   | Hermenegildo Sabat | 7a15  | 2015-05-01      | 2020-05-12 | 1000     | 1003  | 13:00     | 15:00     | 200 | Parte MO generado correctamente |
   | 2000   | Mariela Williams   | 7a15  | 2013-03-01      | 2020-05-12 | 1000     | 1001  | 07:00     | 10:56     | 200 | Parte MO generado correctamente |
   | 2000   | Mariela Williams   | 7a15  | 2013-03-01      | 2020-05-12 | 1000     | 1002  | 10:56     | 13:00     | 200 | Parte MO generado correctamente|   
   | 2000   | Mariela Williams   | 7a15  | 2013-03-01      | 2020-05-12 | 1000     | 1002  | 13:00     | 15:00     | 200 | Parte MO generado correctamente |   
   | 3000   | Pedro Almodovar    | 7a15  | 2017-08-15      | 2023-05-12 | 1000     | 1001  | 08:23     | 10:56     | 200 | Parte MO generado correctamente |
   | 3000   | Pedro Almodovar    | 7a15  | 2017-08-15      | 2023-05-12 | 1000     | 1002  | 10:56     | 13:00     | 200 | Parte MO generado correctamente |      
   | 4000   | Manuel Belgrano    | 15a21 | 2017-08-15      | 2023-05-12 | 2000     | 2004  | 15:00     | 17:26     | 200 | Parte MO generado correctamente |
   | 4000   | Manuel Belgrano    | 15a21 | 2017-08-15      | 2023-05-12 | 2000     | 2010  | 17:56     | 19:50     | 200 | Parte MO generado correctamente |      
   | 4000   | Manuel Belgrano    | 15a21 | 2017-08-15      | 2023-05-12 | 3000     | 3002  | 18:00     | 21:00     | 200 | Parte MO generado correctamente |      
   | 5000   | Soledad Solari     | 15a21 | 2019-06-01      | 2023-05-12 | 4000     | 4004  | 15:00     | 17:26     | 200 | Parte MO generado correctamente |
   | 5000   | Soledad Solari     | 15a21 | 2019-06-01      | 2023-05-12 | 4000     | 4010  | 18:26     | 19:00     | 200 | Parte MO generado correctamente |      
   | 5000   | Soledad Solari     | 15a21 | 2019-06-01      | 2023-05-12 | 4000     | 4002  | 20:00     | 21:00     | 200 | Parte MO generado correctamente|      
   | 6000   | Mariano Moreno     | 15a21 | 2018-05-15      | 2023-05-12 | 1000     | 1001  | 07:00     | 11:00     | 200 | Parte MO generado correctamente |
   | 6000   | Mariano Moreno     | 15a21 | 2018-05-15      | 2023-05-12 | 1000     | 1002  | 10:00     | 14:00     | 200 | Parte MO generado correctamente |      
   | 6000   | Mariano Moreno     | 15a21 | 2018-05-15      | 2023-05-12 | 1000     | 1003  | 13:00     | 15:00     | 200 | Parte MO generado correctamente |      