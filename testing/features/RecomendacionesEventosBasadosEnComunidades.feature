            # language: es
            #eventoEnComunidadesTesting
            Característica: Sugerencias de eventos basados en amigos

            Escenario: Obtener sugerencias de eventos basados en comunidades donde se recomienden tres eventos ordenados por prioridad segun cantidad de etiquetas 
            Dado que se ingresan los datos de un usuario existente "lucasMadryn"
            Cuando se buscan las sugerencias de eventos basados en comunidades
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
                "data": [
                    {
                        "nombre": "Carrera de 10K en Comodoro",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-25T07:00:00Z",
                        "latitud": -45.838061022086976,
                        "longitud": -67.49405805975792
                    },
                    {
                        "nombre": "Torneo natacion 100M en CABA",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-28T15:00:00Z",
                        "latitud": -34.605906167370584,
                        "longitud": -58.421286244002474
                    },
                    {
                        "nombre": "Torneo de Fútbol 5 en Trelew",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-20T18:00:00Z",
                        "latitud": -43.25456793905463,
                        "longitud": -65.30652780881938
                    }
                ]
            }
            """
            Escenario: Obtener sugerencias de eventos basados en comunidades donde se recomienden tres eventos ordenados por prioridad segun cantidad de etiquetas 2
            Dado que se ingresan los datos de un usuario existente "facuMadryn" en eventos basados en comunidades
            Cuando se buscan las sugerencias de eventos basados en comunidades sean
            Entonces se espera que las sugerencias de eventos basados en comunidades sean
            """
            {
                "data": [
                    {
                        "nombre": "Torneo natacion 200M en Bahia Blanca",
                        "fechaDeCreacion": "2024-09-15",
                        "fechaHora": "2025-09-28T15:30:00Z",
                        "latitud": -38.70688604597644,
                        "longitud": -62.261285196916916
                    },
                    {
                        "nombre": "Torneo de Básquet en Posadas",
                        "fechaDeCreacion": "2024-09-16",
                        "fechaHora": "2025-09-22T10:00:00Z",
                        "latitud": -27.389749552546853,
                        "longitud": -55.92589020428568
                    },
                    {
                        "nombre": "Carrera de 5K en Madryn",
                        "fechaDeCreacion": "2024-09-16",
                        "fechaHora": "2025-09-26T08:00:00Z",
                        "latitud": -42.761328851689385,
                        "longitud": -65.04370337286537
                    }
                ]
            }
            """
