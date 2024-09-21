# language: es
Característica: Sugerencia de amigos basados en eventos 

  Escenario: Obtener ninguna sugerencia de amigos basados en comunidades 
    Dado que se ingresan los datos de un usuario existent "joaquin"
    Cuando se buscan las sugerencias de amigos basados en comunidades
    Entonces se espera que las sugerencias de amigos basados en comunidades sean
    """
    {
      "data": []
    }
    """

  Escenario: Obtener sugerencias de amigos basados en comunidades donde se recomienden tres amigos ordenados por prioridad
    Dado que se ingresan los datos de un usuario existent "lucas"
    Cuando se buscan las sugerencias de amigos basados en comunidades
    Entonces se espera que las sugerencias de amigos basados en comunidades sean
    """
    {
        "data": 
            [
                {
                    "nombreUsuario": "juan",
                    "nombreReal": "Juan"
                },
                {
                    "nombreUsuario": "marcos",
                    "nombreReal": "Marcos"
                },
                {
                    "nombreUsuario": "pedro",
                    "nombreReal": "Pedro"
                }
            ]
    }
    """
  Escenario: Obtener sugerencias de amigos basados en comunidades donde se recomienden dos amigos con igual prioridad
    Dado que se ingresan los datos de un usuario existent "pedro"
    Cuando se buscan las sugerencias de amigos basados en comunidades
    Entonces se espera que las sugerencias de amigos basados en comunidades sean
    """
    {
        "data": 
            [
            {
                    "nombreUsuario": "juan",
                    "nombreReal": "Juan"
                },
                {
                    "nombreUsuario": "lucas",
                    "nombreReal": "Lucas"
                }
            ]
    }
    """