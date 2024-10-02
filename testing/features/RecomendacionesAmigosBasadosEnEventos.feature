# language: es
#amigosBasadosEnEventosTesting
Característica: Sugerencia de amigos basados en eventos 

  Escenario: Obtener ninguna sugerencia de amigos basados en eventos 
    Dado que se ingresan los datos de un usuario existente "evelyn_yoga", en amigos por eventos
    Cuando se obtienen las sugerencias de amigos basados en eventos
    Entonces se espera que las sugerencias de amigos basados en eventos sean 
    """
    {
      "data": []
    }
    """

  Escenario: Obtener sugerencias de amigos basados en eventos donde se recomiende un amigo
    Dado que se ingresan los datos de un usuario existente "alan_prog", en amigos por eventos
    Cuando se obtienen las sugerencias de amigos basados en eventos
    Entonces se espera que las sugerencias de amigos basados en eventos sean
    """
    {
      "data": 
        [
          {
            "nombreUsuario": "melisa_fit",
            "nombreReal": "Melisa",
            "correoElectronico": "melisa@example.com",
            "contrasena": "pass123"
          }
        ]
    }
    """

  Escenario: Obtener sugerencias de amigos basados en eventos donde se recomienden dos amigos ordenados por prioridad
    Dado que se ingresan los datos de un usuario existente "juarito22", en amigos por eventos
    Cuando se obtienen las sugerencias de amigos basados en eventos
    Entonces se espera que las sugerencias de amigos basados en eventos sean
    """
    {
      "data": 
        [
          {
            "nombreUsuario": "agustin_mtb",
            "nombreReal": "Agustin",
            "correoElectronico": "agustin@example.com",
            "contrasena": "pass123"
          },
          {
            "nombreUsuario": "matias_trek",
            "nombreReal": "Matias",
            "correoElectronico": "matias@example.com",
            "contrasena": "pass123"
          }
        ]
    }
    """

  Escenario: Obtener sugerencias de amigos basados en eventos donde se recomienden tres amigos ordenados por prioridad
    Dado que se ingresan los datos de un usuario existente "ramiro85", en amigos por eventos
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