# language: es
Característica: Sugerencia de comunidades basadas en amigos

  Escenario: Obtener sugerencias de comunidades basadas en amigos para un usuario sin recomendaciones
    Dado que se ingresan los datos de un usuario existente "lucas123", en comunidades por amigos
    Cuando se obtienen las sugerencias de comunidades basadas en amigos
    Entonces se espera que las sugerencias de comunidades basadas en amigos sean
    """
    {
        "data": []
    }
    """

  Escenario: Obtener sugerencias de comunidades basadas en amigos para un usuario con una recomendacion
    Dado que se ingresan los datos de un usuario existente "maia_rocks", en comunidades por amigos
    Cuando se obtienen las sugerencias de comunidades basadas en amigos
    Entonces se espera que las sugerencias de comunidades basadas en amigos sean
    """
    {
        "data": 
            [
                {
                    "nombre": "Voley en la playa",
                    "fechaDeCreacion": "2022-04-01",
                    "descripcion": "",
                    "cantidadMaximaMiembros": 50
                }
            ]
    }
    """

  Escenario: Obtener sugerencias de comunidades basadas en amigos para un usuario con dos recomendaciones
    Dado que se ingresan los datos de un usuario existente "eric99", en comunidades por amigos
    Cuando se obtienen las sugerencias de comunidades basadas en amigos
    Entonces se espera que las sugerencias de comunidades basadas en amigos sean
    """
    {
        "data": 
            [
                {
                    "nombre": "Running en la playa",
                    "fechaDeCreacion": "2022-05-01",
                    "descripcion": "",
                    "cantidadMaximaMiembros": 50
                },
                {
                    "nombre": "Estiramiento en la playa",
                    "fechaDeCreacion": "2022-06-01",
                    "descripcion": "",
                    "cantidadMaximaMiembros": 50
                }
            ]
    }
    """

  Escenario: Obtener sugerencias de comunidades basadas en amigos para un usuario con tres recomendaciones    Dado que se ingresan los datos de un usuario existente "eric99"
    Dado que se ingresan los datos de un usuario existente "ramiro85", en comunidades por amigos
    Cuando se obtienen las sugerencias de comunidades basadas en amigos
    Entonces se espera que las sugerencias de comunidades basadas en amigos sean
    """
    {
        "data": 
            [
                {
                    "nombre": "Stretching en la playa",
                    "fechaDeCreacion": "2022-08-01",
                    "descripcion": "",
                    "cantidadMaximaMiembros": 50
                },
                {
                    "nombre": "Pilates en la playa",
                    "fechaDeCreacion": "2022-09-01",
                    "descripcion": "",
                    "cantidadMaximaMiembros": 50
                },
                {
                    "nombre": "Yoga en la playa",
                    "fechaDeCreacion": "2022-07-01",
                    "descripcion": "",
                    "cantidadMaximaMiembros": 50
                }
            ]
    }
    """