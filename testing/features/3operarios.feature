# language: es

Característica: Gestión de operarios

   Esquema del escenario: ingreso de nuevo Operario
      Dado que se ingresa el operario con legajo <legajo>, con nombre "<nombre>" cuya categoría es "<categoria>" y pertenece al turno <tipoTurno> a partir de "<fechaTurnoDesde>"
      Cuando presiono el botón de guardar de operarios
      Entonces se espera la siguiente "<respuesta>" de operarios

   Ejemplos:
   | legajo | nombre             | categoria             | tipoTurno |fechaTurnoDesde | respuesta                                                    |
   | 1000   | Hermenegildo Sabat | Oficial Albañil       | 1         |2003-01-01      | Operario/a 1000 Hermenegildo Sabat ingresado/a correctamente |
   | 2000   | Mariela Williams   | Medio Oficial Albañil | 1         |2013-03-01      | Operario/a 2000 Mariela Williams ingresado/a correctamente   |
   | 3000   | Pedro Almodovar    | Oficial Carpintero    | 1         |2017-08-15      | Operario/a 3000 Pedro Almodovar ingresado/a correctamente    |
   | 4000   | Manuel Belgrano    | Oficial Armador       | 2         |2017-08-15      | Operario/a 4000 Manuel Belgrano ingresado/a correctamente    |
   | 5000   | Soledad Solari     | Medio Oficial Armador | 2         |2019-06-01      | Operario/a 5000 Soledad Solari ingresado/a correctamente     |
   | 6000   | Mariano Moreno     | Ayudante              | 2         |2018-05-15      | Operario/a 6000 Mariano Moreno ingresado/a correctamente     |
   | 7000   | Evelyn Kovacs      | Oficial Carpintero    | 3         |2020-06-10      | Operario/a 7000 Evelyn Kovacs ingresado/a correctamente      |
   | 8000   | Pepe Sanchez       | Oficial Albañil       | 3         |2020-06-10      | Operario/a 8000 Pepe Sanchez ingresado/a correctamente       |
   | 9000   | Santiago Segura    | Oficial Especializado | 3         |2020-06-11      | Operario/a 9000 Santiago Segura ingresado/a correctamente    |
   | 10000  | Carla Giraldo      | Oficial Albañil       | 3         |2020-06-11      | Operario/a 10000 Carla Giraldo ingresado/a correctamente     |
   | 11000  | Javier Perez       | Medio Oficial Armador | 3         |2020-06-12      | Operario/a 11000 Javier Perez ingresado/a correctamente      |
   | 12000  | Ana Belen          | Oficial Carpintero    | 3         |2020-06-12      | Operario/a 12000 Ana Belen ingresado/a correctamente         |
   | 13000  | Daniel Lopez       | Ayudante              | 3         |2020-06-13      | Operario/a 13000 Daniel Lopez ingresado/a correctamente      |
   | 14000  | Laura Rodriguez    | Oficial Armador       | 3         |2020-06-13      | Operario/a 14000 Laura Rodriguez ingresado/a correctamente   |
   | 15000  | Patricia Fernandez | Medio Oficial Albañil | 3         |2020-06-14      | Operario/a 15000 Patricia Fernandez ingresado/a correctamente|
   | 16000  | Antonio Sanchez    | Oficial Especializado | 3         |2020-06-14      | Operario/a 16000 Antonio Sanchez ingresado/a correctamente   |
   | 17000  | Monica Diaz        | Oficial Albañil       | 3         |2020-06-15      | Operario/a 17000 Monica Diaz ingresado/a correctamente       |
   | 18000  | Pablo Ruiz         | Medio Oficial Armador | 3         |2020-06-15      | Operario/a 18000 Pablo Ruiz ingresado/a correctamente        |
   | 19000  | Andrea Perez       | Oficial Carpintero    | 3         |2020-06-16      | Operario/a 19000 Andrea Perez ingresado/a correctamente      |
   | 20000  | Maria Gonzalez     | Oficial Armador       | 3         |2020-06-16      | Operario/a 20000 Maria Gonzalez ingresado/a correctamente    |
   | 21000  | Luisa Martinez     | Oficial Especializado | 3         |2020-06-17      | Operario/a 21000 Luisa Martinez ingresado/a correctamente    |
   | 22000  | Juan Rodriguez     | Ayudante              | 3         |2020-06-17      | Operario/a 22000 Juan Rodriguez ingresado/a correctamente    |
   | 23000  | Carolina Lopez     | Medio Oficial Albañil | 3         |2020-06-18      | Operario/a 23000 Carolina Lopez ingresado/a correctamente    |
   | 24000  | Sergio Fernandez   | Oficial Albañil       | 3         |2020-06-18      | Operario/a 24000 Sergio Fernandez ingresado/a correctamente  |
   | 25000  | Rosa Diaz          | Oficial Especializado | 3         |2020-06-19      | Operario/a 25000 Rosa Diaz ingresado/a correctamente         |
   | 26000  | David Gomez        | Oficial Carpintero    | 3         |2020-06-19      | Operario/a 26000 David Gomez ingresado/a correctamente       |
   | 27000  | Elena Sanchez      | Oficial Armador       | 3         |2020-06-20      | Operario/a 27000 Elena Sanchez ingresado/a correctamente     |
   | 28000  | Carlos Rodriguez   | Medio Oficial Armador | 3         |2020-06-20      | Operario/a 28000 Carlos Rodriguez ingresado/a correctamente  |
   | 29000  | Sonia Fernandez    | Ayudante              | 4         |2020-06-21      | Operario/a 29000 Sonia Fernandez ingresado/a correctamente   |
   | 30000  | Oscar Lopez        | Oficial Especializado | 4         |2020-06-21      | Operario/a 30000 Oscar Lopez ingresado/a correctamente       |
   | 31000  | Cristina Diaz      | Medio Oficial Albañil | 4         |2020-06-22      | Operario/a 31000 Cristina Diaz ingresado/a correctamente     |
   | 32000  | Patricia Garcia    | Oficial Albañil       | 4         |2020-06-22      | Operario/a 32000 Patricia Garcia ingresado/a correctamente   |
   | 33000  | Marta Rodriguez    | Oficial Especializado | 4         |2020-06-23      | Operario/a 33000 Marta Rodriguez ingresado/a correctamente   |
   | 34000  | Juan Perez         | Oficial Armador       | 4         |2020-06-23      | Operario/a 34000 Juan Perez ingresado/a correctamente        |
   | 35000  | Maria Lopez        | Medio Oficial Armador | 4         |2020-06-24      | Operario/a 35000 Maria Lopez ingresado/a correctamente       |
   | 36000  | Carlos Gomez       | Oficial Carpintero    | 4         |2020-06-24      | Operario/a 36000 Carlos Gomez ingresado/a correctamente      |
   | 37000  | Laura Martinez     | Oficial Albañil       | 4         |2020-06-25      | Operario/a 37000 Laura Martinez ingresado/a correctamente    |
   | 38000  | Jorge Rodriguez    | Oficial Especializado | 4         |2020-06-25      | Operario/a 38000 Jorge Rodriguez ingresado/a correctamente   |
   | 39000  | Ana Fernandez      | Medio Oficial Albañil | 4         |2020-06-26      | Operario/a 39000 Ana Fernandez ingresado/a correctamente     |
   | 40000  | Luis Garcia        | Ayudante              | 4         |2020-06-26      | Operario/a 40000 Luis Garcia ingresado/a correctamente       |
   | 41000  | Marta Lopez        | Oficial Armador       | 4         |2020-06-27      | Operario/a 41000 Marta Lopez ingresado/a correctamente       |
   | 42000  | Jose Martinez      | Oficial Especializado | 4         |2020-06-27      | Operario/a 42000 Jose Martinez ingresado/a correctamente     |
   | 43000  | Diego Perez        | Ayudante              | 4         |2020-06-28      | Operario/a 43000 Diego Perez ingresado/a correctamente       |
   | 44000  | Lucia Rodriguez    | Medio Oficial Armador | 4         |2020-06-28      | Operario/a 44000 Lucia Rodriguez ingresado/a correctamente   |
   | 45000  | Pablo Sanchez      | Oficial Armador       | 4         |2020-06-29      | Operario/a 45000 Pablo Sanchez ingresado/a correctamente     |
   | 46000  | Sara Lopez         | Ayudante              | 4         |2020-06-29      | Operario/a 46000 Sara Lopez ingresado/a correctamente        |
   | 47000  | Hugo Fernandez     | Oficial Carpintero    | 4         |2020-06-30      | Operario/a 47000 Hugo Fernandez ingresado/a correctamente    |
   | 48000  | Diego Garcia       | Ayudante              | 4         |2020-06-30      | Operario/a 48000 Diego Garcia ingresado/a correctamente      |
   | 49000  | Clara Martinez     | Oficial Especializado | 4         |2020-07-01      | Operario/a 49000 Clara Martinez ingresado/a correctamente    |
   | 50000  | Ruben Rodriguez    | Oficial Especializado | 4         |2020-07-01      | Operario/a 50000 Ruben Rodriguez ingresado/a correctamente   |