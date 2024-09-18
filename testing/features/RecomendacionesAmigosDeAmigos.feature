# language: es
Característica: Sugerencia de amigos en común

  Escenario: Obtener sugerencias de amigos en común para un usuario
    Dado que se ingresan los datos de un usuario existente "lucas123"
    Cuando se obtienen las sugerencias de amigos en común
    Entonces se espera que las sugerencias sean 
  """
{
  "data": [
    {
      "nombreUsuario": "juarito654",
      "nombreReal": "Juarito Sánchez",
      "fechaNacimiento": "1996-11-11",
      "fechaDeCreacion": "2024-09-18",
      "correoElectronico": "juarito.sanchez@example.com",
      "descripcion": "Amante del voleibol y la programación."
    },
    {
      "nombreUsuario": "ramiro123",
      "nombreReal": "Ramiro González",
      "fechaNacimiento": "1992-02-25",
      "fechaDeCreacion": "2024-09-18",
      "correoElectronico": "ramiro.gonzalez@example.com",
      "descripcion": "Ciclista aficionado y amante del café."
    },
    {
      "nombreUsuario": "agustin789",
      "nombreReal": "Agustín Ramírez",
      "fechaNacimiento": "1994-05-22",
      "fechaDeCreacion": "2024-09-18",
      "correoElectronico": "agustin.ramirez@example.com",
      "descripcion": "Fan del baloncesto y las aventuras al aire libre."
    }
  ]
}
  """
