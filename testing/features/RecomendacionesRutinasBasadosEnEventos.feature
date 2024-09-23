            # language: es
            #rutinasBasadasEnEventosTesting
            Característica: Recomendación de rutinas basadas en eventos

            Escenario: Recomendar rutinas realizadas por usuarios que participan en el mismo evento
            Dado que se ingresan los datos de un usuario existente "ana"
            Cuando se buscan las sugerencias de rutinas basadas en eventos
            Entonces se espera que las sugerencias de rutinas basadas en eventos sean
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
                        "nombre": "Fuerza avanzada",
                        "descripcion": "Rutina avanzada de fuerza y resistencia.",
                        "duracionMinutosPorDia": 50,
                        "dificultad": "AVANZADO"
                    }
                ]
            }
            """

            Escenario: Recomendar la unica rutina realizada por usuarios que participan en el mismo evento
            Dado que se ingresan los datos de un usuario existente "juan"
            Cuando se buscan las sugerencias de rutinas basadas en eventos
            Entonces se espera que las sugerencias de rutinas basadas en eventos sean
            """
            {
                "data": [
                    {
                        "nombre": "Cardio avanzado con fuerza",
                        "descripcion": "Rutina combinada de cardio y fuerza.",
                        "duracionMinutosPorDia": 45,
                        "dificultad": "INTERMEDIO"
                    }
                ]
            }
            """
            Escenario: No se recomienda nada porque es el unico participante del evento
            Dado que se ingresan los datos de un usuario existente "joaquin"
            Cuando se buscan las sugerencias de rutinas basadas en eventos
            Entonces se espera que las sugerencias de rutinas basadas en eventos sean
            """
            {
                "data": []
            }
            """
            Escenario: No se recomienda nada porque no participa en ningun evento
            Dado que se ingresan los datos de un usuario existente "carlos"
            Cuando se buscan las sugerencias de rutinas basadas en eventos
            Entonces se espera que las sugerencias de rutinas basadas en eventos sean
            """
            {
                "data": []
            }
            """
            Escenario: Una de las rutinas recomendadas ya la realiza. Las otras son ordenadas alfabeticamente por empate
            Dado que se ingresan los datos de un usuario existente "pedro"
            Cuando se buscan las sugerencias de rutinas basadas en eventos
            Entonces se espera que las sugerencias de rutinas basadas en eventos sean
            """
            {
                "data": [
                    {
                        "nombre": "Entrenamiento funcional",
                        "descripcion": "Rutina de entrenamiento funcional.",
                        "duracionMinutosPorDia": 35,
                        "dificultad": "INTERMEDIO"
                    },
                    {
                        "nombre": "Fuerza avanzada",
                        "descripcion": "Rutina avanzada de fuerza y resistencia.",
                        "duracionMinutosPorDia": 50,
                        "dificultad": "AVANZADO"
                    }
                ]
            }
            """
