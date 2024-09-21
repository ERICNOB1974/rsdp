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
    });
    
    CREATE (et1:Etiqueta{
      id:1,
      nombre: 'Atletismo'
      });

      MATCH (etiq:Etiqueta { nombre :'Atletismo' })


      MATCH (evento1:Evento { id:1 })
      MATCH (evento2:Evento { id:2 })



      MATCH (u1:Usuario { nombreUsuario: 'pedrito' })



      MATCH (r1:Rutina { nombre: 'Ejercicios tren superior' })
      MATCH (r2:Rutina { nombre: 'Rutina de Core Avanzado' })
      MATCH (r3:Rutina { nombre: 'Rutina HIIT Express' })
      MATCH (r4:Rutina { nombre: 'Rutina de Acondicionamiento General' })
      MATCH (r5:Rutina { nombre: 'Rutina de Potencia Explosiva' })
      MATCH (r6:Rutina { nombre: 'Rutina Funcional Intermedia' })
      MATCH (r6:Rutina { nombre: 'Rutina de Estiramientos Activos' })

      
      
      MERGE (evento1)-[:ETIQUETADO_CON]->(etiq)
      MERGE (r1)-[:ETIQUETADA_CON]->(etiq)
      MERGE (r2)-[:ETIQUETADA_CON]->(etiq)
      MERGE (u1)-[:PARTICIPA_EN]->(evento1)
