# language: es
#amigosBasadoEnComunidadesTesting
Característica: Sugerencia de amigos basados en comunidades 

  Escenario: El usuario participa en una sola comunidad. No debe sugerir nada
    Dado que se ingresan los datos de un usuario existente "joaquin"
    Cuando se buscan las sugerencias de amigos basados en comunidades
    Entonces se espera que las sugerencias de amigos basados en comunidades sean
    """
    {
      "data": []
    }
    """

  Escenario: Obtener 3 sugerencias de amigos basados en comunidades
    Dado que se ingresan los datos de un usuario existente "lucas"
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
    Dado que se ingresan los datos de un usuario existente "pedro"
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