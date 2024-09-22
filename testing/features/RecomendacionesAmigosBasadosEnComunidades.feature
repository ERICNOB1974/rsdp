# language: es
#amigosBasadosEnComunidadesTesting
Característica: Sugerencia de amigos basados en comunidades 

  Escenario: La unica sugerencia no la trae porque es el mismo usuario quien creo el evento.
    Dado que se ingresan los datos de un usuario existente "marcos"
    Cuando se buscan las sugerencias de amigos basados en comunidades
    Entonces se espera que las sugerencias de amigos basados en comunidades sean
    """
    {
      "data": []
    }
    """

  Escenario: Obtener sugerencias de eventos basados en comunidades donde se recomienden dos eventos ordenados por cantidad de etiquetas
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