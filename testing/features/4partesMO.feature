# language: es

Característica: Cargar partes de Mano de obra
   Gestionar la carga de partes de MO considerando distintos escenarios y contextos

   Esquema del escenario: 
   Dado el operario con legajo <legajo> y nombre "<nombre>"
   Y que trabajó el día "<fechaParte>" para el proyecto "<proyecto>" en la tarea "<tarea>" desde las "<horaDesde>" horas hasta las "<horaHasta>" horas
   Cuando se solicitan generar el parte
   Entonces se obtiente <statusCode> con "<statusText>"

   Ejemplos:
   | legajo | nombre            | fechaParte | proyecto | tarea | horaDesde | horaHasta | statusCode | statusText                      |
   | 1000   | Hermenegildo Sabat| 2023-05-12 | 1000     | 1001  | 07:00     | 10:56     | 200        | Parte MO generado correctamente |
   | 1000   | Hermenegildo Sabat| 2023-05-12 | 1000     | 1002  | 10:56     | 13:00     | 200        | Parte MO generado correctamente |
   | 1000   | Hermenegildo Sabat| 2023-05-12 | 1000     | 1003  | 13:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 2000   | Mariela Williams  | 2023-05-12 | 1000     | 1001  | 07:00     | 10:56     | 200        | Parte MO generado correctamente |
   | 2000   | Mariela Williams  | 2023-05-12 | 1000     | 1002  | 10:56     | 13:00     | 200        | Parte MO generado correctamente |
   | 2000   | Mariela Williams  | 2023-05-12 | 1000     | 1003  | 13:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 3000   | Pedro Almodovar   | 2023-05-12 | 1000     | 1001  | 08:23     | 10:56     | 200        | Parte MO generado correctamente |
   | 3000   | Pedro Almodovar   | 2023-05-12 | 1000     | 1002  | 10:56     | 13:00     | 200        | Parte MO generado correctamente |
   | 4000   | Manuel Belgrano   | 2023-05-12 | 2000     | 2004  | 15:00     | 17:26     | 200        | Parte MO generado correctamente |
   | 4000   | Manuel Belgrano   | 2023-05-12 | 2000     | 2010  | 17:56     | 19:50     | 200        | Parte MO generado correctamente |
   | 4000   | Manuel Belgrano   | 2023-05-12 | 3000     | 3002  | 18:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 5000   | Soledad Solari    | 2023-05-12 | 4000     | 4004  | 15:00     | 17:26     | 200        | Parte MO generado correctamente |
   | 5000   | Soledad Solari    | 2023-05-12 | 4000     | 4010  | 18:26     | 19:00     | 200        | Parte MO generado correctamente |
   | 5000   | Soledad Solari    | 2023-05-12 | 4000     | 4002  | 20:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 6000   | Mariano Moreno    | 2023-05-12 | 1000     | 1001  | 07:00     | 11:00     | 200        | Parte MO generado correctamente |
   | 6000   | Mariano Moreno    | 2023-05-12 | 1000     | 1002  | 10:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 6000   | Mariano Moreno    | 2023-05-12 | 1000     | 1003  | 13:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 7000   | Evelyn Kovacs     | 2024-03-15 | 4000     | 4004  | 07:30     | 11:00     | 200        | Parte MO generado correctamente |
   | 7000   | Evelyn Kovacs     | 2024-03-15 | 4000     | 4010  | 12:00     | 15:30     | 200        | Parte MO generado correctamente |
   | 7000   | Evelyn Kovacs     | 2024-03-15 | 4000     | 4002  | 16:30     | 19:30     | 200        | Parte MO generado correctamente |
   | 8000   | Pepe Sanchez      | 2023-09-01 | 1000     | 1001  | 15:00     | 16:30     | 200        | Parte MO generado correctamente |
   | 8000   | Pepe Sanchez      | 2023-09-01 | 1000     | 1002  | 16:30     | 18:00     | 200        | Parte MO generado correctamente |
   | 8000   | Pepe Sanchez      | 2023-09-01 | 1000     | 1003  | 18:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 9000   | Santiago Segura   | 2023-07-10 | 4000     | 4004  | 07:00     | 10:30     | 200        | Parte MO generado correctamente |
   | 9000   | Santiago Segura   | 2023-07-10 | 4000     | 4010  | 10:30     | 14:30     | 200        | Parte MO generado correctamente |
   | 9000   | Santiago Segura   | 2023-07-10 | 4000     | 4002  | 14:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 10000  | Carla Giraldo     | 2023-11-15 | 1000     | 1001  | 07:00     | 11:00     | 200        | Parte MO generado correctamente |
   | 10000  | Carla Giraldo     | 2023-11-15 | 1000     | 1002  | 11:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 10000  | Carla Giraldo     | 2023-11-15 | 1000     | 1003  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 11000  | Javier Perez      | 2023-11-15 | 4000     | 4004  | 07:00     | 13:30     | 200        | Parte MO generado correctamente |
   | 11000  | Javier Perez      | 2023-11-15 | 4000     | 4010  | 13:30     | 14:30     | 200        | Parte MO generado correctamente |
   | 11000  | Javier Perez      | 2023-11-15 | 4000     | 4002  | 14:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 12000  | Ana Belen         | 2023-06-01 | 1000     | 1001  | 07:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 12000  | Ana Belen         | 2023-06-01 | 1000     | 1002  | 14:00     | 14:30     | 200        | Parte MO generado correctamente |
   | 12000  | Ana Belen         | 2023-06-01 | 1000     | 1003  | 14:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 13000  | Daniel Lopez      | 2023-06-02 | 4000     | 4004  | 07:00     | 08:30     | 200        | Parte MO generado correctamente |
   | 13000  | Daniel Lopez      | 2023-06-02 | 4000     | 4010  | 08:30     | 10:30     | 200        | Parte MO generado correctamente |
   | 13000  | Daniel Lopez      | 2023-06-02 | 4000     | 4002  | 10:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 14000  | Laura Rodriguez   | 2023-06-03 | 1000     | 1001  | 07:00     | 13:00     | 200        | Parte MO generado correctamente |
   | 14000  | Laura Rodriguez   | 2023-06-03 | 1000     | 1002  | 13:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 14000  | Laura Rodriguez   | 2023-06-03 | 1000     | 1003  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 15000  | Patricia Fernandez| 2023-06-04 | 4000     | 4004  | 07:00     | 10:30     | 200        | Parte MO generado correctamente |
   | 15000  | Patricia Fernandez| 2023-06-04 | 4000     | 4010  | 10:30     | 14:30     | 200        | Parte MO generado correctamente |
   | 15000  | Patricia Fernandez| 2023-06-04 | 4000     | 4002  | 14:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 16000  | Antonio Sanchez   | 2023-06-05 | 1000     | 1001  | 07:00     | 10:00     | 200        | Parte MO generado correctamente |
   | 16000  | Antonio Sanchez   | 2023-06-05 | 1000     | 1002  | 10:00     | 11:00     | 200        | Parte MO generado correctamente |
   | 16000  | Antonio Sanchez   | 2023-06-05 | 1000     | 1003  | 11:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 17000  | Monica Diaz       | 2023-06-06 | 4000     | 4004  | 07:00     | 09:00     | 200        | Parte MO generado correctamente |
   | 17000  | Monica Diaz       | 2023-06-06 | 4000     | 4010  | 09:00     | 11:00     | 200        | Parte MO generado correctamente |
   | 17000  | Monica Diaz       | 2023-06-06 | 4000     | 4002  | 11:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 18000  | Pablo Ruiz        | 2023-06-07 | 1000     | 1001  | 07:00     | 12:00     | 200        | Parte MO generado correctamente |
   | 18000  | Pablo Ruiz        | 2023-06-07 | 1000     | 1002  | 12:00     | 13:00     | 200        | Parte MO generado correctamente |
   | 18000  | Pablo Ruiz        | 2023-06-07 | 1000     | 1003  | 13:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 19000  | Andrea Perez      | 2023-06-08 | 4000     | 4004  | 07:00     | 11:30     | 200        | Parte MO generado correctamente |
   | 19000  | Andrea Perez      | 2023-06-08 | 4000     | 4010  | 11:30     | 12:00     | 200        | Parte MO generado correctamente |
   | 19000  | Andrea Perez      | 2023-06-08 | 4000     | 4002  | 12:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 20000  | Maria Gonzalez    | 2023-06-09 | 1000     | 1001  | 07:00     | 10:00     | 200        | Parte MO generado correctamente |
   | 20000  | Maria Gonzalez    | 2023-06-09 | 1000     | 1002  | 10:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 20000  | Maria Gonzalez    | 2023-06-09 | 1000     | 1003  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 21000  | Luisa Martinez    | 2023-06-10 | 4000     | 4004  | 07:00     | 12:00     | 200        | Parte MO generado correctamente |
   | 21000  | Luisa Martinez    | 2023-06-10 | 4000     | 4010  | 12:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 21000  | Luisa Martinez    | 2023-06-10 | 4000     | 4002  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 22000  | Juan Rodriguez    | 2023-06-11 | 1000     | 1001  | 15:00     | 16:00     | 200        | Parte MO generado correctamente |
   | 22000  | Juan Rodriguez    | 2023-06-11 | 1000     | 1002  | 16:00     | 16:30     | 200        | Parte MO generado correctamente |
   | 22000  | Juan Rodriguez    | 2023-06-11 | 1000     | 1003  | 16:30     | 21:00     | 200        | Parte MO generado correctamente |
   | 23000  | Carolina Lopez    | 2023-06-12 | 4000     | 4004  | 15:00     | 18:00     | 200        | Parte MO generado correctamente |
   | 23000  | Carolina Lopez    | 2023-06-12 | 4000     | 4010  | 18:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 23000  | Carolina Lopez    | 2023-06-12 | 4000     | 4002  | 19:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 24000  | Sergio Fernandez  | 2023-06-13 | 1000     | 1001  | 15:00     | 16:00     | 200        | Parte MO generado correctamente |
   | 24000  | Sergio Fernandez  | 2023-06-13 | 1000     | 1002  | 16:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 24000  | Sergio Fernandez  | 2023-06-13 | 1000     | 1003  | 19:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 25000  | Rosa Diaz         | 2023-06-14 | 4000     | 4004  | 15:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 25000  | Rosa Diaz         | 2023-06-14 | 4000     | 4010  | 19:00     | 20:00     | 200        | Parte MO generado correctamente |
   | 25000  | Rosa Diaz         | 2023-06-14 | 4000     | 4002  | 20:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 26000  | David Gomez       | 2023-06-15 | 1000     | 1001  | 15:00     | 18:00     | 200        | Parte MO generado correctamente |
   | 26000  | David Gomez       | 2023-06-15 | 1000     | 1002  | 18:00     | 19:30     | 200        | Parte MO generado correctamente |
   | 26000  | David Gomez       | 2023-06-15 | 1000     | 1003  | 19:30     | 21:00     | 200        | Parte MO generado correctamente |
   | 27000  | Elena Sanchez     | 2023-06-16 | 4000     | 4004  | 15:00     | 16:00     | 200        | Parte MO generado correctamente |
   | 27000  | Elena Sanchez     | 2023-06-16 | 4000     | 4010  | 16:00     | 17:00     | 200        | Parte MO generado correctamente |
   | 27000  | Elena Sanchez     | 2023-06-16 | 4000     | 4002  | 17:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 28000  | Carlos Rodriguez  | 2023-06-17 | 1000     | 1001  | 15:00     | 15:30     | 200        | Parte MO generado correctamente |
   | 28000  | Carlos Rodriguez  | 2023-06-17 | 1000     | 1002  | 15:30     | 19:30     | 200        | Parte MO generado correctamente |
   | 28000  | Carlos Rodriguez  | 2023-06-17 | 1000     | 1003  | 19:30     | 21:00     | 200        | Parte MO generado correctamente |
   | 29000  | Sonia Fernandez   | 2023-06-18 | 4000     | 4004  | 07:00     | 13:30     | 200        | Parte MO generado correctamente |
   | 29000  | Sonia Fernandez   | 2023-06-18 | 4000     | 4010  | 13:30     | 14:00     | 200        | Parte MO generado correctamente |
   | 29000  | Sonia Fernandez   | 2023-06-18 | 4000     | 4002  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 30000  | Oscar Lopez       | 2023-06-19 | 1000     | 1001  | 15:00     | 16:00     | 200        | Parte MO generado correctamente |
   | 30000  | Oscar Lopez       | 2023-06-19 | 1000     | 1002  | 16:00     | 18:00     | 200        | Parte MO generado correctamente |
   | 30000  | Oscar Lopez       | 2023-06-19 | 1000     | 1003  | 18:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 31000  | Cristina Diaz     | 2023-06-20 | 4000     | 4004  | 15:00     | 17:00     | 200        | Parte MO generado correctamente |
   | 31000  | Cristina Diaz     | 2023-06-20 | 4000     | 4010  | 17:00     | 20:00     | 200        | Parte MO generado correctamente |
   | 31000  | Cristina Diaz     | 2023-06-20 | 4000     | 4002  | 20:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 32000  | Patricia Garcia   | 2023-06-21 | 1000     | 1001  | 15:00     | 17:30     | 200        | Parte MO generado correctamente |
   | 32000  | Patricia Garcia   | 2023-06-21 | 1000     | 1002  | 17:30     | 18:00     | 200        | Parte MO generado correctamente |
   | 32000  | Patricia Garcia   | 2023-06-21 | 1000     | 1003  | 18:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 33000  | Marta Rodriguez   | 2023-06-22 | 4000     | 4004  | 15:00     | 16:00     | 200        | Parte MO generado correctamente |
   | 33000  | Marta Rodriguez   | 2023-06-22 | 4000     | 4010  | 16:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 33000  | Marta Rodriguez   | 2023-06-22 | 4000     | 4002  | 19:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 34000  | Juan Perez        | 2023-06-23 | 1000     | 1001  | 15:00     | 15:30     | 200        | Parte MO generado correctamente |
   | 34000  | Juan Perez        | 2023-06-23 | 1000     | 1002  | 15:30     | 17:00     | 200        | Parte MO generado correctamente |
   | 34000  | Juan Perez        | 2023-06-23 | 1000     | 1003  | 17:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 35000  | Maria Lopez       | 2023-06-24 | 4000     | 4004  | 15:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 35000  | Maria Lopez       | 2023-06-24 | 4000     | 4010  | 19:00     | 20:00     | 200        | Parte MO generado correctamente |
   | 35000  | Maria Lopez       | 2023-06-24 | 4000     | 4002  | 20:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 36000  | Carlos Gomez      | 2023-06-27 | 1000     | 1001  | 07:00     | 10:00     | 200        | Parte MO generado correctamente |
   | 36000  | Carlos Gomez      | 2023-06-27 | 1000     | 1002  | 11:00     | 13:00     | 200        | Parte MO generado correctamente |
   | 36000  | Carlos Gomez      | 2023-06-27 | 1000     | 1003  | 13:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 37000  | Laura Martinez    | 2023-06-27 | 4000     | 4004  | 07:00     | 13:00     | 200        | Parte MO generado correctamente |
   | 37000  | Laura Martinez    | 2023-06-27 | 4000     | 4010  | 12:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 37000  | Laura Martinez    | 2023-06-27 | 4000     | 4002  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 38000  | Jorge Rodriguez   | 2023-06-27 | 1000     | 1001  | 07:00     | 13:00     | 200        | Parte MO generado correctamente |
   | 38000  | Jorge Rodriguez   | 2023-06-27 | 1000     | 1002  | 13:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 38000  | Jorge Rodriguez   | 2023-06-27 | 1000     | 1003  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 39000  | Ana Fernandez     | 2023-06-28 | 4000     | 4004  | 07:00     | 13:00     | 200        | Parte MO generado correctamente |
   | 39000  | Ana Fernandez     | 2023-06-28 | 4000     | 4010  | 13:00     | 14:30     | 200        | Parte MO generado correctamente |
   | 39000  | Ana Fernandez     | 2023-06-28 | 4000     | 4002  | 14:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 40000  | Luis Garcia       | 2023-06-29 | 1000     | 1001  | 07:00     | 12:00     | 200        | Parte MO generado correctamente |
   | 40000  | Luis Garcia       | 2023-06-29 | 1000     | 1002  | 12:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 40000  | Luis Garcia       | 2023-06-29 | 1000     | 1003  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 41000  | Marta Lopez       | 2023-06-30 | 4000     | 4004  | 07:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 41000  | Marta Lopez       | 2023-06-30 | 4000     | 4010  | 14:00     | 14:30     | 200        | Parte MO generado correctamente |
   | 41000  | Marta Lopez       | 2023-06-30 | 4000     | 4002  | 14:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 42000  | Jose Martinez     | 2023-07-01 | 1000     | 1001  | 07:00     | 10:30     | 200        | Parte MO generado correctamente |
   | 42000  | Jose Martinez     | 2023-07-01 | 1000     | 1002  | 10:30     | 14:00     | 200        | Parte MO generado correctamente |
   | 42000  | Jose Martinez     | 2023-07-01 | 1000     | 1003  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 43000  | Diego Perez       | 2023-07-02 | 4000     | 4004  | 07:00     | 12:00     | 200        | Parte MO generado correctamente |
   | 43000  | Diego Perez       | 2023-07-02 | 4000     | 4010  | 12:00     | 12:30     | 200        | Parte MO generado correctamente |
   | 43000  | Diego Perez       | 2023-07-02 | 4000     | 4002  | 12:30     | 15:00     | 200        | Parte MO generado correctamente |
   | 44000  | Lucia Rodriguez   | 2023-07-05 | 1000     | 1001  | 15:00     | 17:00     | 200        | Parte MO generado correctamente |
   | 44000  | Lucia Rodriguez   | 2023-07-05 | 1000     | 1002  | 17:00     | 18:00     | 200        | Parte MO generado correctamente |
   | 44000  | Lucia Rodriguez   | 2023-07-05 | 1000     | 1003  | 18:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 45000  | Pablo Sanchez     | 2023-07-05 | 4000     | 4004  | 07:00     | 13:00     | 200        | Parte MO generado correctamente |
   | 45000  | Pablo Sanchez     | 2023-07-05 | 4000     | 4010  | 13:00     | 14:00     | 200        | Parte MO generado correctamente |
   | 45000  | Pablo Sanchez     | 2023-07-05 | 4000     | 4002  | 14:00     | 15:00     | 200        | Parte MO generado correctamente |
   | 46000  | Sara Lopez        | 2023-07-05 | 1000     | 1001  | 15:00     | 16:00     | 200        | Parte MO generado correctamente |
   | 46000  | Sara Lopez        | 2023-07-05 | 1000     | 1002  | 16:00     | 17:00     | 200        | Parte MO generado correctamente |
   | 46000  | Sara Lopez        | 2023-07-05 | 1000     | 1003  | 17:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 47000  | Hugo Fernandez    | 2023-07-06 | 4000     | 4004  | 15:00     | 18:00     | 200        | Parte MO generado correctamente |
   | 47000  | Hugo Fernandez    | 2023-07-06 | 4000     | 4010  | 18:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 47000  | Hugo Fernandez    | 2023-07-06 | 4000     | 4002  | 19:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 48000  | Diego Garcia      | 2023-07-07 | 1000     | 1001  | 15:00     | 16:00     | 200        | Parte MO generado correctamente |
   | 48000  | Diego Garcia      | 2023-07-07 | 1000     | 1002  | 16:00     | 20:00     | 200        | Parte MO generado correctamente |
   | 48000  | Diego Garcia      | 2023-07-07 | 1000     | 1003  | 20:00     | 21:00     | 200        | Parte MO generado correctamente |
   | 49000  | Clara Martinez    | 2023-07-08 | 4000     | 4004  | 15:00     | 20:00     | 200        | Parte MO generado correctamente |
   | 49000  | Clara Martinez    | 2023-07-08 | 4000     | 4010  | 20:00     | 20:30     | 200        | Parte MO generado correctamente |
   | 49000  | Clara Martinez    | 2023-07-08 | 4000     | 4002  | 20:30     | 21:00     | 200        | Parte MO generado correctamente |
   | 50000  | Ruben Rodriguez   | 2023-07-09 | 1000     | 1001  | 15:00     | 17:00     | 200        | Parte MO generado correctamente |
   | 50000  | Ruben Rodriguez   | 2023-07-09 | 1000     | 1002  | 17:00     | 19:00     | 200        | Parte MO generado correctamente |
   | 50000  | Ruben Rodriguez   | 2023-07-09 | 1000     | 1003  | 19:00     | 21:00     | 200        | Parte MO generado correctamente |