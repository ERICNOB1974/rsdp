CREATE
(evento1:Evento {
  id: 1,
  nombre: 'Torneo de Fútbol 5',
  fechaHora: datetime('2024-09-20T18:00:00'),
  ubicacion: 'Cancha Los Olivos',
  descripcion: 'Un torneo de fútbol 5 entre amigos.',
  cantidadMaximaParticipantes: 10,
  fechaCreacion: date('2024-09-15')
  }),
  (evento2:Evento {
    id: 2,
    nombre: 'Carrera de 10K',
    fechaHora: datetime('2024-09-25T07:00:00'),
    ubicacion: 'Parque de la Ciudad',
    descripcion: 'Carrera de 10 kilómetros en el parque.',
    cantidadMaximaParticipantes: 50,
    fechaCreacion: date('2024-09-15')
    })
    
    CREATE (et1:Etiqueta{
      id:1,
      nombre: 'Atletismo'
      })
      CREATE (et2:Etiqueta{
        id:2,
        nombre: 'Futbol'
        })
        CREATE (et3:Etiqueta{
          id:3,
          nombre: 'Natacion'
          })
          
          CREATE (lucas:Usuario { nombreUsuario: 'lucas', nombreReal: 'Lucas' })
          CREATE (juan:Usuario { nombreUsuario: 'juan', nombreReal: 'Juan' })
          CREATE (marcos:Usuario { nombreUsuario: 'marcos', nombreReal: 'Marcos' })
          CREATE (joaquin:Usuario { nombreUsuario: 'joaquin', nombreReal: 'Joaquin' })
          CREATE (pedro:Usuario { nombreUsuario: 'pedro', nombreReal: 'Pedro' })
          
          CREATE (comu1:Comunidad { nombre: 'Comunidad atletismo', descripcion: 'Comunidad1' })
          CREATE (comu2:Comunidad { nombre: 'comunidad futbol', descripcion: 'Comunidad2' })
          CREATE (comu3:Comunidad { nombre: 'comunidad natacion', descripcion: 'Comunidad3' })
          
          MERGE (evento1)-[:ETIQUETADO_CON]->(et1)
          MERGE (evento1)-[:ETIQUETADO_CON]->(et2)
          MERGE (evento2)-[:ETIQUETADO_CON]->(et3)
          MERGE (evento2)-[:ETIQUETADO_CON]->(et1)

          MERGE (comu1)-[:ETIQUETADA_CON]->(et1)
          MERGE (comu1)-[:ETIQUETADA_CON]->(et1)
          MERGE (com21)-[:ETIQUETADA_CON]->(et1)
          MERGE (comu3)-[:ETIQUETADA_CON]->(et1)
          
          MERGE (lucas)-[:PARTICIPA_EN]->(evento1)
