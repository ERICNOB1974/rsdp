# language: es
#comunidadesBasadasEnComunidadesTesting
Característica: Sugerencia de comunidades basadas en eventos

  Escenario: Obtener sugerencias de eventos basados en eventos para un usuario que está inscripto a un evento
    Dado que se ingresan los datos de un usuario existente "lucasMadryn", en eventos por eventos
    Cuando se obtienen las sugerencias de eventos basados en eventos
    Entonces se espera que las sugerencias de eventos basados en eventos sean
    """
    {
      "data": 
      [
        {
          "nombre": "Aerobico en la plaza de Comodoro",
          "fechaDeCreacion": "2023-08-10",
          "fechaHora": "2024-10-02T16:00:00Z",
          "latitud": -45.8666676301876,
          "longitud": -67.52256636176106,
          "descripcion": "Aerobico en Comodoro",
          "cantidadMaximaParticipantes": 20,
          "esPrivadoParaLaComunidad": false
        },
        {
          "nombre": "Caminata en el parque de Bahia Blanca",
          "fechaDeCreacion": "2023-08-10",
          "fechaHora": "2024-10-03T14:00:00Z",
          "latitud": -38.7139680437262,
          "longitud": -62.2872759788477,
          "descripcion": "Caminata tranquila en el parque",
          "cantidadMaximaParticipantes": 20,
          "esPrivadoParaLaComunidad": false
        },
        {
          "nombre": "Entrenamiento de natación en Posadas",
          "fechaDeCreacion": "2023-08-10",
          "fechaHora": "2024-10-03T12:00:00Z",
          "latitud": -27.38714029003687,
          "longitud": -55.92143101061461,
          "descripcion": "Entrenamiento en la piscina municipal",
          "cantidadMaximaParticipantes": 30,
          "esPrivadoParaLaComunidad": false
        }
      ]
    }
    """
