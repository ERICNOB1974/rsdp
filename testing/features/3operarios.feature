# language: es

Característica: Gestión de operarios

   Esquema del escenario: ingreso de nuevo Operario
      Dado que se ingresa el operario con legajo <legajo>, con nombre "<nombre>" cuya categoría es "<categoria>" y pertenece al turno "<turno>" a partir de "<fechaTurnoDesde>"
      Cuando presiono el botón de guardar de operarios
      Entonces se espera la siguiente "<respuesta>" de operarios

   Ejemplos:
   | legajo | nombre             | categoria             | fechaTurnoDesde | respuesta    |
   | 1000   | Hermenegildo Sabat | Oficial Albañil       | 2003-01-01      | Operario/a 1000 Hermenegildo Sabat ingresado/a correctamente |
   | 2000   | Mariela Williams   | Medio Oficial Albañil | 2013-03-01      | Operario/a 2000 Mariela Williams ingresado/a correctamente |
   | 3000   | Pedro Almodovar    | Oficial Carpintero    | 2017-08-15      | Operario/a 3000 Pedro Almodovar ingresado/a correctamente |
   | 4000   | Manuel Belgrano    | Oficial Armador       | 2017-08-15      | Operario/a 4000 Manuel Belgrano ingresado/a correctamente |
   | 5000   | Soledad Solari     | Medio Oficial Armador | 2019-06-01      | Operario/a 5000 Soledad Solari ingresado/a correctamente |
   | 6000   | Mariano Moreno     | Ayudante              | 2018-05-15      | Operario/a 6000 Mariano Moreno ingresado/a correctamente |
   | 7000   | Evelyn K           | Oficial Carpintero    | 2020-06-10      | Operario/a 7000 Evelyn K ingresado/a correctamente |
   | 8000   | Pepe Sanchez       | Oficial Albañil       | 2020-06-10      | Operario/a 8000 Pepe Sanchez ingresado/a correctamente |
