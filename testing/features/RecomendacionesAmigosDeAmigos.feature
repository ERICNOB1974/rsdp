# language: es
Característica: Sugerencia de amigos en común

  Escenario: Obtener sugerencias de amigos en común para un usuario
    Dado que se ingresan los datos de un usuario existente "evelyn987", en amigos por amigos
    Cuando se obtienen las sugerencias de amigos en común
    Entonces se espera que las sugerencias de amigos en común sean 
    """
        {
        "data": 
          [
            {
              "nombreUsuario": "agustin789",
              "nombreReal": "Agustín Ramírez",
              "fechaNacimiento": "1994-05-22",
              "fechaDeCreacion": "2024-09-19",
              "correoElectronico": "agustin.ramirez@example.com",
              "descripcion": "Fan del baloncesto y las aventuras al aire libre."
            },
            {
              "nombreUsuario": "ignacio987",
              "nombreReal": "Ignacio Martínez",
              "fechaNacimiento": "1993-12-30",
              "fechaDeCreacion": "2024-09-19",
              "correoElectronico": "ignacio.martinez@example.com",
              "descripcion": "Tenis y música son sus pasiones."
            },
            {
              "nombreUsuario": "matias456",
              "nombreReal": "Matías López",
              "fechaNacimiento": "1995-07-15",
              "fechaDeCreacion": "2024-09-19",
              "correoElectronico": "matias.lopez@example.com",
              "descripcion": "Apasionado del rugby y los autos."
            }
          ]
        }
    """

  Escenario: Obtener sugerencias de amigos en común para un usuario sin amigos
    Dado que se ingresan los datos de un usuario existente "lucas123", en amigos por amigos
    Cuando se obtienen las sugerencias de amigos en común
    Entonces se espera que las sugerencias de amigos en común sean
    """
    {
      "data": []
    }
    """

  Escenario: Obtener sugerencias de amigos en común para un usuario con dos amigos
    Dado que se ingresan los datos de un usuario existente "melisa987", en amigos por amigos
    Cuando se obtienen las sugerencias de amigos en común cuando se tienen dos amigos
    Entonces se espera que las sugerencias de amigos en común sean
    """
      {
      "data": 
        [
          {
            "nombreUsuario": "alan321",
            "nombreReal": "Alan Rodríguez",
            "fechaNacimiento": "1998-01-30",
            "fechaDeCreacion": "2024-09-19",
            "correoElectronico": "alan.rodriguez@example.com",
            "descripcion": "Aficionado a los videojuegos y las películas de acción."
          },
          {
            "nombreUsuario": "juanchon987",
            "nombreReal": "Juanchon Martínez",
            "fechaNacimiento": "1993-12-30",
            "fechaDeCreacion": "2024-09-19",
            "correoElectronico": "juanchon.martinez@example.com",
            "descripcion": "Cricket y música son sus pasiones."
          }
        ]
      }
    """