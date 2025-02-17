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
        "data": [
          {
            "nombre": "Maratón de la ciudad",
            "fechaDeCreacion": null,
            "fechaHora": "2025-10-15T09:00:00Z",
            "ubicacion": null,
            "descripcion": "Maratón para corredores de todos los niveles."
          },
          {
            "nombre": "Entrenamiento de fuerza avanzada",
            "fechaDeCreacion": null,
            "fechaHora": "2025-09-25T07:00:00Z",
            "ubicacion": null,
            "descripcion": "Entrenamiento intensivo de fuerza avanzada."
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
        "data": [
          {
            "nombre": "Entrenamiento funcional en el parque",
            "fechaDeCreacion": null,
            "fechaHora": "2025-09-29T10:00:00Z",
            "ubicacion": null,
            "descripcion": "Entrenamiento funcional intensivo."
          },
          {
            "nombre": "Maratón de la ciudad",
            "fechaDeCreacion": null,
            "fechaHora": "2025-10-15T09:00:00Z",
            "ubicacion": null,
            "descripcion": "Maratón para corredores de todos los niveles."
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
        "data": [
          {
            "nombre": "Entrenamiento de fuerza avanzada",
            "fechaDeCreacion": null,
            "fechaHora": "2025-09-25T07:00:00Z",
            "ubicacion": null,
            "descripcion": "Entrenamiento intensivo de fuerza avanzada."
          },
          {
            "nombre": "Entrenamiento funcional en el parque",
            "fechaDeCreacion": null,
            "fechaHora": "2025-09-29T10:00:00Z",
            "ubicacion": null,
            "descripcion": "Entrenamiento funcional intensivo."
          },
          {
            "nombre": "Maratón de la ciudad",
            "fechaDeCreacion": null,
            "fechaHora": "2025-10-15T09:00:00Z",
            "ubicacion": null,
            "descripcion": "Maratón para corredores de todos los niveles."
          }
        ]
      }
      """
      Escenario: Sugerir eventos para juan
      Dado que se ingresan los datos de un usuario existente "juan"
      Y "juan" realiza rutinas etiquetadas con "Flexiones"
      Cuando se obtienen las sugerencias de eventos basadas en rutinas
      Entonces se espera que los eventos sugeridos para "juan" sean
      """
      {
        "data": [
          {
            "nombre": "Calistenia inicial",
            "fechaDeCreacion": null,
            "fechaHora": "2025-09-20T07:00:00Z",
            "ubicacion": null,
            "descripcion": "Calistenia principiante."
          },
          {
            "nombre": "Calistenia avanzada",
            "fechaDeCreacion": null,
            "fechaHora": "2025-09-25T07:00:00Z",
            "ubicacion": null,
            "descripcion": "Calistenia avanzado"
          }
        ]
      }
      """

      Escenario: No sugerir eventos para luna
      Dado que se ingresan los datos de un usuario existente "luna"
      Y "luna" realiza rutinas etiquetadas con "Pasado"
      Cuando se obtienen las sugerencias de eventos basadas en rutinas
      Entonces se espera que los eventos sugeridos para "luna" sean
      """
      {
        "data": []
      }
      """

