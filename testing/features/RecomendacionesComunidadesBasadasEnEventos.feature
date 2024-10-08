# language: es
#comunidadesBasadasEnComunidadesTesting
Característica: Sugerencia de comunidades basadas en eventos

  Escenario: Obtener sugerencias de comunidades basadas en eventos para un usuario que está inscripto a una comunidad que tiene 7 etiquetas
    Dado que se ingresan los datos de un usuario existente "lucas", en comunidades por eventos
    Cuando se obtienen las sugerencias de comunidades basadas en eventos
    Entonces se espera que las sugerencias de comunidades basadas en eventos sean
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
        "nombre": "Ciclistas de Montaña de Madryn",
        "fechaDeCreacion": "2021-01-02",
        "descripcion": "Rutas largas para ciclistas",
        "cantidadMaximaMiembros": 51,
        "esPrivada": false,
        "latitud": -42.76442823854689,
        "longitud": -65.03365087594793
        }
    ]
    }
    """
