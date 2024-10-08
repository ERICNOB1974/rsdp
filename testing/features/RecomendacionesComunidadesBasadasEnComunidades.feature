# language: es
#comunidadesBasadasEnComunidadesTesting
Característica: Sugerencia de comunidades basadas en comunidades

  Escenario: Obtener sugerencias de comunidades basadas en comunidades para un usuario que está inscripto a una comunidad que tiene 7 etiquetas
    Dado que se ingresan los datos de un usuario existente "lucas", en comunidades por comunidades
    Cuando se obtienen las sugerencias de comunidades basadas en comunidades
    Entonces se espera que las sugerencias de comunidades basadas en comunidades sean
    """
    {
    "data": 
    [
        {
        "nombre": "Corredores de Ruta de Comodoro",
        "fechaDeCreacion": "2020-05-15",
        "descripcion": "Grupo para aficionados al running",
        "cantidadMaximaMiembros": 100,
        "esPrivada": false,
        "latitud": -45.8397063939941,
        "longitud": -67.47694735091086
        },
        {
        "nombre": "Nadadores Urbanos de Bahia Blanca",
        "fechaDeCreacion": "2019-08-20",
        "descripcion": "Entrenamientos en piscinas y ríos",
        "cantidadMaximaMiembros": 30,
        "esPrivada": true,
        "latitud": -38.71450381606208,
        "longitud": -62.265303322668416
        },
        {
        "nombre": "Escaladores de Montaña de Jujuy",
        "fechaDeCreacion": "2021-03-10",
        "descripcion": "Aventuras en escalada",
        "cantidadMaximaMiembros": 25,
        "esPrivada": false,
        "latitud": -22.108040819161882,
        "longitud": -65.59842140253284
        }
    ]
    }
    """
