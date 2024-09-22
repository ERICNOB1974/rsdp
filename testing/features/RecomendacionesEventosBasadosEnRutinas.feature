# language: es
#eventosBasadosEnRutinasTesting
Característica: Sugerencias de eventos basados en rutinas

  Escenario: Sugerir eventos para Lucas
    Dado que se ingresan los datos de un usuario existente "lucas123"
    Y "lucas123" participa en el evento "Yoga al aire libre"
    Y "lucas123" realiza rutinas etiquetadas con "Cardio" y "Avanzada"
    Cuando se obtienen las sugerencias de eventos basadas en rutinas
    Entonces se espera que los eventos sugeridos para "lucas123" sean 
    """
      {
        "data": 
            [
                {
                "nombre": "Maratón de la ciudad",
                "fechaDeCreacion": null,
                "fechaHora": "2024-10-15T09:00:00Z",
                "ubicacion": null,
                "descripcion": "Maratón para corredores de todos los niveles.",
                "cantidadMaximaParticipantes": 0
                },
                {
                "nombre": "Entrenamiento de fuerza avanzada",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-25T07:00:00Z",
                "ubicacion": null,
                "descripcion": "Entrenamiento intensivo de fuerza avanzada.",
                "cantidadMaximaParticipantes": 0
                }
            ]
       }
    """

  Escenario: Sugerir eventos para Facundo
    Dado que se ingresan los datos de un usuario existente "facundo789"
    Y "facundo789" crea el evento "Entrenamiento de fuerza avanzada"
    Y "facundo789" realiza rutinas etiquetadas con "Fuerza", "Avanzada", "Fucional" y "Cardio"
    Cuando se obtienen las sugerencias de eventos basadas en rutinas
    Entonces se espera que los eventos sugeridos para "facundo789" sean 
    """
      {
        "data": 
            [
                {
                "nombre": "Entrenamiento funcional en el parque",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-29T10:00:00Z",
                "ubicacion": null,
                "descripcion": "Entrenamiento funcional intensivo.",
                "cantidadMaximaParticipantes": 0
                },
                {
                "nombre": "Maratón de la ciudad",
                "fechaDeCreacion": null,
                "fechaHora": "2024-10-15T09:00:00Z",
                "ubicacion": null,
                "descripcion": "Maratón para corredores de todos los niveles.",
                "cantidadMaximaParticipantes": 0
                }
            ]
        }
    """

  Escenario: Sugerir eventos para Eric
    Dado que se ingresan los datos de un usuario existente "eric456"
    Y "eric456" realiza rutinas etiquetadas con "Funcional", "Fuerza", "Avanzada" y "Cardio"
    Cuando se obtienen las sugerencias de eventos basadas en rutinas
    Entonces se espera que los eventos sugeridos para "eric456" sean 
    """
      {
        "data": 
            [
                {
                "nombre": "Entrenamiento de fuerza avanzada",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-25T07:00:00Z",
                "ubicacion": null,
                "descripcion": "Entrenamiento intensivo de fuerza avanzada.",
                "cantidadMaximaParticipantes": 0
                },
                {
                "nombre": "Entrenamiento funcional en el parque",
                "fechaDeCreacion": null,
                "fechaHora": "2024-09-29T10:00:00Z",
                "ubicacion": null,
                "descripcion": "Entrenamiento funcional intensivo.",
                "cantidadMaximaParticipantes": 0
                },
                {
                "nombre": "Maratón de la ciudad",
                "fechaDeCreacion": null,
                "fechaHora": "2024-10-15T09:00:00Z",
                "ubicacion": null,
                "descripcion": "Maratón para corredores de todos los niveles.",
                "cantidadMaximaParticipantes": 0
                }
            ]
      }
    """
