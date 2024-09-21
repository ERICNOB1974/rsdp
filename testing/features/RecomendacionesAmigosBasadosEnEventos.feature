# language: es
Característica: Sugerencia de amigos basados en eventos 

  Escenario: Obtener ninguna sugerencia de amigos basados en eventos 
    Dado que se ingresan los datos de un usuario existente "evelyn_yoga"
    Cuando se obtienen las sugerencias de amigos basados en eventos
    Entonces se espera que las sugerencias de amigos basados en eventos sean 
    """
    {
      "data": []
    }
    """

  Escenario: Obtener sugerencias de amigos basados en eventos donde se recomienden tres amigos ordenados por prioridad
    Dado que se ingresan los datos de un usuario existente "ramiro85"
    Cuando se obtienen las sugerencias de amigos basados en eventos
    Entonces se espera que las sugerencias de amigos basados en eventos sean
    """
    {
        "data": 
            [
                {
                    "nombreUsuario": "maia_rocks",
                    "nombreReal": "Maia",
                    "correoElectronico": "maia@example.com",
                    "contrasena": "pass123"
                },
                {
                    "nombreUsuario": "lucas123",
                    "nombreReal": "Lucas",
                    "correoElectronico": "lucas@example.com",
                    "contrasena": "pass123"
                },
                {
                    "nombreUsuario": "eric99",
                    "nombreReal": "Eric",
                    "correoElectronico": "eric@example.com",
                    "contrasena": "pass123"
                }
            ]
    }
    """