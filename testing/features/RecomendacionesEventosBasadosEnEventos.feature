# language: es
Característica: Recomendación de rutinas de tus amigos

  Escenario: Eventos ordenados por cantidad de etiquetas en comun
    Dado que se ingresan los datos de un usuario existente "lucas123"
    Y el usuario "lucas123" participa en eventos
    Cuando se obtienen las sugerencias de eventos basados en eventos
    Entonces se espera que los eventos sugeridos sean 
    """
      {
          "data": 
            [
                {
                "nombre": "Yoga para principiantes",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-24T08:00:00Z",
                "ubicacion": null,
                "descripcion": "Clase de yoga para principiantes.",
                "cantidadMaximaParticipantes": 0
                },
                {
                "nombre": "Zumba en el parque",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-28T11:00:00Z",
                "ubicacion": null,
                "descripcion": "Clase de Zumba al aire libre.",
                "cantidadMaximaParticipantes": 0
                },
                {
                "nombre": "Carrera de obstáculos",
                "fechaDeCreacion": null,
                "fechaHora": "2024-10-10T09:00:00Z",
                "ubicacion": null,
                "descripcion": "Carrera de obstáculos para todos los niveles.",
                "cantidadMaximaParticipantes": 0
                }
            ]
      }
    """

  Escenario: Eventos con misma cantidad de etiquetas en comun y se ordena por proximidad de fecha
    Dado que se ingresan los datos de un usuario existente "facundo789"
    Y el usuario "facundo789" participa en eventos
    Cuando se obtienen las sugerencias de eventos basados en eventos
    Entonces se espera que los eventos sugeridos sean 
    """
      {
        "data": 
             [
                {
                "nombre": "Yoga al aire libre",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-22T08:00:00Z",
                "ubicacion": null,
                "descripcion": "Clase de yoga al aire libre.",
                "cantidadMaximaParticipantes": 0
                },
                {
                "nombre": "Torneo de fuerza",
                "fechaDeCreacion": null,
                "fechaHora": "2024-10-01T09:00:00Z",
                "ubicacion": null,
                "descripcion": "Competencia de fuerza en el gimnasio.",
                "cantidadMaximaParticipantes": 0
            
                },
                {
                "nombre": "Zumba en el parque",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-28T11:00:00Z",
                "ubicacion": null,
                "descripcion": "Clase de Zumba al aire libre.",
                "cantidadMaximaParticipantes": 0
                }
            ]
      }
    """