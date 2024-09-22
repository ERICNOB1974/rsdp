            # language: es
            #rutinasBasadasEnEventosEtiquetasTesting
            Característica: Recomendación de rutinas basadas en eventos etiquetados

            Escenario: Dos formas de llegar a la misma rutina. lo muestra una sola vez.
            Dado que se ingresan los datos de un usuario existente "marcos"
            Cuando se buscan las sugerencias de rutinas basadas en eventos etiquetados
            Entonces se espera que las sugerencias de rutinas basadas en eventos etiquetados sean
            """
            {
                "data": [
                    {
                        "nombre": "Cardio para principiantes",
                        "descripcion": "Rutina de cardio para principiantes.",
                        "duracionMinutosPorDia": 40,
                        "dificultad": "PRINCIPIANTE"
                    },
                    {
                        "nombre": "Entrenamiento funcional",
                        "descripcion": "Rutina de entrenamiento funcional.",
                        "duracionMinutosPorDia": 35,
                        "dificultad": "INTERMEDIO"
                    }
                ]
            }
            """

            Escenario: Ninguna rutina tiene la misma etiqueta que el evento
            Dado que se ingresan los datos de un usuario existente "martin"
            Cuando se buscan las sugerencias de rutinas basadas en eventos etiquetados
            Entonces se espera que las sugerencias de rutinas basadas en eventos etiquetados sean
            """
            {
                "data": []
            }
            """

            Escenario: Ninguna rutina tiene la misma etiqueta que el evento
            Dado que se ingresan los datos de un usuario existente "lucas"
            Cuando se buscan las sugerencias de rutinas basadas en eventos etiquetados
            Entonces se espera que las sugerencias de rutinas basadas en eventos etiquetados sean
            """
            {
                "data": [
                    {
                        "nombre": "Resistencia ",
                        "descripcion": "Entrena la resistencia. Ideal para nadadores.",
                        "duracionMinutosPorDia": 40,
                        "dificultad": "PRINCIPIANTE"
                    },
                    {
                        "nombre": "Cardio para principiantes",
                        "descripcion": "Rutina de cardio para principiantes.",
                        "duracionMinutosPorDia": 40,
                        "dificultad": "PRINCIPIANTE"
                    }
                ]
            }
            """

