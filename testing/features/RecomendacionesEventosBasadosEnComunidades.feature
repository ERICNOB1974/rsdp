            # language: es
            #eventoEnComunidadesTesting
            Característica: Sugerencia de eventos basados en comunidades

            Escenario: No se recomienda nada porque el usuario no participa en ninguna comunidad
            Dado que se ingresan los datos de un usuario existente "joaquin"
            Cuando se buscan las sugerencias de eventos basados en comunidades
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
                "data": []
            }
            """
            Escenario: No se recomienda nada porque el usuario es el creador del unico evento que le puede recomendar
            Dado que se ingresan los datos de un usuario existente "marcos"
            Cuando se buscan las sugerencias de eventos basados en comunidades
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
                "data": []
            }
            """

            Escenario: Obtener sugerencias de eventos basados en comunidades donde se recomienden dos eventos ordenados por prioridad segun cantidad de etiquetas
            Dado que se ingresan los datos de un usuario existente "ana"
            Cuando se buscan las sugerencias de eventos basados en comunidades
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
                "data": [
                    {
                        "nombre": "Torneo de Fútbol 5",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2024-09-20T18:00:00Z"
                    },
                    {
                        "nombre": "Futbol 11",
                        "fechaDeCreacion": "2024-09-25",
                        "fechaHora": "2024-10-01T22:30:00Z"
                    }
                ]
            }
            """
            Escenario: Obtener sugerencias de eventos basados en comunidades donde se recomienden dos eventos ordenados por prioridad segun cantidad de etiquetas
            Dado que se ingresan los datos de un usuario existente "diego"
            Cuando se buscan las sugerencias de eventos basados en comunidades
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
                "data": [
                    {
                        "nombre": "Carrera de 10K",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2024-09-25T07:00:00Z"
                    },
                    {
                        "nombre": "Carrera de 5K",
                        "fechaDeCreacion": "2024-09-16",
                        "fechaHora": "2024-09-26T08:00:00Z"
                    },
                    {
                        "nombre": "Carrera de Montaña 15K",
                        "fechaDeCreacion": "2024-09-18",
                        "fechaHora": "2024-10-01T07:30:00Z"
                    }
                ]
            }
            """
            Escenario: Obtener sugerencias de eventos basados en comunidades donde se recomienda un evento porque lucas participa en el otro recomendable
            Dado que se ingresan los datos de un usuario existente "lucas"
            Cuando se buscan las sugerencias de eventos basados en comunidades
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
                "data": [
                    {
                        "nombre": "Torneo natacion 200M ",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2024-09-28T15:30:00Z"
                    }
                ]
            }
            """
            Escenario: El usuario participa en dos comunidades
            Dado que se ingresan los datos de un usuario existente "patricia"
            Cuando se buscan las sugerencias de eventos basados en comunidades
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
            "data": [
            {
            "nombre": "Clase de Yoga",
            "fechaDeCreacion": "2024-09-17",
            "fechaHora": "2024-09-24T09:00:00Z"
            },
            {
            "nombre": "Clase abierta de pilates",
            "fechaDeCreacion": "2024-09-17",
            "fechaHora": "2024-09-21T10:00:00Z"
            }
            ]
            }
            """
