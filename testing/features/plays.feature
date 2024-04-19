# language: es

Característica: Gestión de operarios

   Esquema del escenario: ingreso de nuevo Operario
      Dado que se ingresa el operario con legajo <legajo>, con nombre "<nombre>" cuya categoría es "<categoria>"
      Cuando presiono el botón de guardar
      Entonces se espera la siguiente "<respuesta>"

   Ejemplos:
   | legajo | nombre             | categoria             | respuesta |
   | 1000   | Hermenegildo Sabat | Oficial Albañil       | Operario/a 1000 Hermenegildo Sabat ingresado/a correctamente |
   | 2000   | Mariela Williams   | Medio Oficial Albañil | Operario/a 2000 Mariela Williams ingresado/a correctamente |
   | 3000   | Pedro Almodovar    | Oficial Carpintero    | Operario/a 3000 Pedro Almodovar ingresado/a correctamente |
   | 4000   | Manuel Belgrano    | Oficial Armador       | Operario/a 4000 Manuel Belgrano ingresado/a correctamente |
   | 5000   | Soledad Solari     | Medio Oficial Armador | Operario/a 5000 Soledad Solari ingresado/a correctamente |
   | 6000   | Mariano Moreno     | Ayudante              | Operario/a 6000 Mariano Moreno ingresado/a correctamente |

