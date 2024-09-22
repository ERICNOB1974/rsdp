# language: es
Característica: Sugerencia de rutinas basadas en las que realizan los miembros de una comunidad a la que pertenece el usuario

  Escenario: Obtener sugerencias de rutinas basadas en comunidades para un usuario en una comunidad sin miembros
    Dado que se ingresan los datos de un usuario existente "lucas123", en rutinas por comunidades
    Cuando se obtienen las sugerencias de rutinas basadas en comunidades
    Entonces se espera que las sugerencias de rutinas basadas en comunidades sean 
    """
    {
      "data": []
    }
    """

  Escenario: Obtener sugerencias de rutinas basadas en comunidades donde se recomienda una sola rutina
    Dado que se ingresan los datos de un usuario existente "maia_rocks", en rutinas por comunidades
    Cuando se obtienen las sugerencias de rutinas basadas en comunidades
    Entonces se espera que las sugerencias de rutinas basadas en comunidades sean
    """
    {
        "data": 
            [
                {
                    "nombre": "Ejercicios tren superior",
                    "descripcion": "Rutina de ejemplo 1",
                    "duracionMinutosPorDia": 30
                }
            ]
    }
    """

Escenario: Obtener sugerencias de rutinas basadas en comunidades donde se recomiendan dos rutinas
    Dado que se ingresan los datos de un usuario existente "eric99", en rutinas por comunidades
    Cuando se obtienen las sugerencias de rutinas basadas en comunidades
    Entonces se espera que las sugerencias de rutinas basadas en comunidades sean
    """
    {
        "data": 
            [
                {
                    "nombre": "Rutina HIIT Express",
                    "descripcion": "Rutina popular",
                    "duracionMinutosPorDia": 45
                },
                {
                    "nombre": "Rutina de Acondicionamiento General",
                    "descripcion": "Rutina menos popular",
                    "duracionMinutosPorDia": 30
                }
            ]
    }
    """

Escenario: Obtener sugerencias de rutinas basadas en comunidades donde se recomiendan tres rutinas
    Dado que se ingresan los datos de un usuario existente "ramiro85", en rutinas por comunidades
    Cuando se obtienen las sugerencias de rutinas basadas en comunidades
    Entonces se espera que las sugerencias de rutinas basadas en comunidades sean
    """
    {
        "data": 
            [
                {
                    "nombre": "Rutina Funcional Intermedia",
                    "descripcion": "Rutina muy popular",
                    "duracionMinutosPorDia": 60
                },
                {
                    "nombre": "Rutina de Estiramientos Activos",
                    "descripcion": "Rutina moderadamente popular",
                    "duracionMinutosPorDia": 45
                },
                {
                    "nombre": "Rutina de Core Avanzado",
                    "descripcion": "Rutina poco popular",
                    "duracionMinutosPorDia": 30
                }
            ]
    }
    """