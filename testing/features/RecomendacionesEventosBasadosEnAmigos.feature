            # language: es
            # eventosBasadosEnAmigosTesting
            Característica: Sugerencias de eventos basados en amigos

            Escenario: Sugerir eventos para martin
            Dado que se ingresan los datos de un usuario existente "martin"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
                    {
                        "nombre": "Torneo natacion 200M ",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-28T15:30:00Z"
                    },
                    {
                        "nombre": "Torneo natacion 100M",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-28T15:00:00Z"
                    }
                ]
            }
            """

            Escenario: Sugerir eventos para juan
            Dado que se ingresan los datos de un usuario existente "juan"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
                    {
                        "nombre": "Clase de Yoga",
                        "fechaDeCreacion": "2024-09-17",
                        "fechaHora": "2025-09-24T09:00:00Z"
                    }
                ]
            }
            """

            Escenario: Sugerir eventos para martin
            Dado que se ingresan los datos de un usuario existente "pedro"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
                    {
                        "nombre": "Carrera de 5K",
                        "fechaDeCreacion": "2024-09-16",
                        "fechaHora": "2025-09-26T08:00:00Z"
                    },
                    {
                        "nombre": "Carrera de 10K",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-25T07:00:00Z"
                    },
                    {
                        "nombre": "Carrera de Montaña 15K",
                        "fechaDeCreacion": "2024-09-18",
                        "fechaHora": "2025-10-01T07:30:00Z"
                    }
                ]
            }
            """

            Escenario: Sugerir eventos para martin
            Dado que se ingresan los datos de un usuario existente "joaquin"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
                    {
                        "nombre": "Carrera de 10K",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-25T07:00:00Z"
                    },
                    {
                        "nombre": "Carrera de Montaña 15K",
                        "fechaDeCreacion": "2024-09-18",
                        "fechaHora": "2025-10-01T07:30:00Z"
                    }
                ]
            }
            """

            Escenario: Sugerir eventos para martin
            Dado que se ingresan los datos de un usuario existente "lucas"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": []
            }
            """
            Escenario: Sugerir eventos para martin
            Dado que se ingresan los datos de un usuario existente "diego"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
                    {
                        "nombre": "Torneo de Fútbol 5",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-20T18:00:00Z"
                    }
                ]
            }
            """

            Escenario: Prioriza etiquetas, despues amigos.
            Dado que se ingresan los datos de un usuario existente "lucia"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
                    {
                        "nombre": "Estiramiento Muscular",
                        "fechaDeCreacion": "2024-09-25",
                        "fechaHora": "2025-10-11T10:30:00Z"
                    },
                    {
                        "nombre": "Torneo natacion 200M ",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-28T15:30:00Z"
                    },
                    {
                        "nombre": "Clase abierta de pilates",
                        "fechaDeCreacion": "2024-09-17",
                        "fechaHora": "2025-09-21T10:00:00Z"
                    }
                ]
            }
            """

            Escenario: Hector crea el evento, no tiene que recomendarle ese
            Dado que se ingresan los datos de un usuario existente "hector"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
                    {
                        "nombre": "Ciclismo en la rambla",
                        "fechaDeCreacion": "2024-09-01",
                        "fechaHora": "2025-09-30T10:30:00Z"
                    }
                ]
            }
            """

            Escenario: El unico evento que puede recomendar ya paso, no le recomienda nada
            Dado que se ingresan los datos de un usuario existente "marta"
            Cuando se buscan las sugerencias de eventos basadas en amigos
            Entonces se espera que las sugerencias de eventos basados en amigos sean
            """
            {
                "data": [
        
                ]
            }
            """

