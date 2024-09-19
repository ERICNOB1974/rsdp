// Lucas Pérez
MATCH (u:Usuario { nombreUsuario: 'lucas123' })
MATCH (r1:Rutina { nombre: 'Rutina Fuerza Básica' })
MATCH (r2:Rutina { nombre: 'Rutina Core y Abdomen' })
MATCH (r3:Rutina { nombre: 'Rutina Flexibilidad Básica' })
WITH u, r1, r2, r3
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-20') }]->(r1)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-12') }]->(r2)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-14'), fechaDeFin: date('2024-09-17') }]->(r3);

// Maia Rodríguez
MATCH (u2:Usuario {nombreUsuario: 'maia_rocks' })
MATCH (r4:Rutina { nombre: 'Rutina de Agilidad y Coordinación' })
MATCH (r5:Rutina { nombre: 'Rutina Resistencia Total' })
MATCH (r6:Rutina { nombre: 'Rutina de Potencia Explosiva' })
WITH u2, r4, r5, r6
CREATE (u2)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10'), fechaDeFin: date('2024-09-10') }]->(r4)
CREATE (u2)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15') }]->(r5)
CREATE (u2)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-21'), fechaDeFin: date('2024-09-25') }]->(r6);

// Eric González
MATCH (u:Usuario { nombreUsuario: 'eric99' })
MATCH (r7:Rutina { nombre: 'Rutina Cardio Intensa' })
MATCH (r8:Rutina { nombre: 'Rutina de Hipertrofia Muscular' })
MATCH (r9:Rutina { nombre: 'Rutina de Recuperación Activa' })
WITH u, r7, r8, r9
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-20'), fechaDeFin: date('2024-09-20') }]->(r7)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-21') }]->(r8)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-20') }]->(r9);

// Ramiro García
MATCH (u:Usuario { nombreUsuario: 'ramiro85' })
MATCH (r10:Rutina { nombre: 'Rutina Flexibilidad Básica' })
MATCH (r11:Rutina { nombre: 'Rutina de Movilidad Articular' })
MATCH (r12:Rutina { nombre: 'Rutina de Fortalecimiento del Tren Superior' })
WITH u, r10, r11, r12
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10'), fechaDeFin: date('2024-09-13') }]->(r10)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-11') }]->(r11)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-14'), fechaDeFin: date('2024-09-30') }]->(r12);

// Alan López
MATCH (u:Usuario { nombreUsuario: 'alan_prog' })
MATCH (r13:Rutina { nombre: 'Rutina de Hipertrofia Muscular' })
MATCH (r14:Rutina { nombre: 'Rutina de Agilidad y Coordinación' })
MATCH (r15:Rutina { nombre: 'Rutina de Core Avanzado' })
WITH u, r13, r14, r15
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-15') }]->(r13)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-22') }]->(r14)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10'), fechaDeFin: date('2024-09-20') }]->(r15);

// Melisa Fernández
MATCH (u:Usuario { nombreUsuario: 'melisa_fit' })
MATCH (r16:Rutina { nombre: 'Rutina de Estiramientos Activos' })
MATCH (r17:Rutina { nombre: 'Rutina de Recuperación Activa' })
MATCH (r18:Rutina { nombre: 'Rutina Funcional Intermedia' })
WITH u, r16, r17, r18
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-15') }]->(r16)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-25') }]->(r17)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-25') }]->(r18);

// Juarito Molina
MATCH (u:Usuario { nombreUsuario: 'juarito22' })
MATCH (r19:Rutina { nombre: 'Rutina de Resistencia Cardiovascular' })
MATCH (r20:Rutina { nombre: 'Rutina de Core Avanzado' })
WITH u, r19, r20
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-14'), fechaDeFin: date('2024-09-18') }]->(r19)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-19') }]->(r20);

// Agustín Díaz
MATCH (u:Usuario { nombreUsuario: 'agustin_mtb' })
MATCH (r21:Rutina { nombre: 'Rutina Fuerza Básica' })
MATCH (r22:Rutina { nombre: 'Rutina Cardio Intensa' })
MATCH (r23:Rutina { nombre: 'Rutina de Movilidad Articular' })
MATCH (r24:Rutina { nombre: 'Rutina Flexibilidad Básica' })
WITH u, r21, r22, r23, r24
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10'), fechaDeFin: date('2024-09-11') }]->(r21)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-11') }]->(r22)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15') }]->(r23)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-19'), fechaDeFin: date('2024-09-30') }]->(r24);

// Matías Herrera
MATCH (u:Usuario { nombreUsuario: 'matias_trek' })
MATCH (r25:Rutina { nombre: 'Rutina de Hipertrofia Muscular' })
MATCH (r26:Rutina { nombre: 'Rutina Cardio Intensa' })
MATCH (r27:Rutina { nombre: 'Rutina de Recuperación Activa' })
WITH u, r25, r26, r27
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r25)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-20'), fechaDeFin: date('2024-09-10') }]->(r26)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-11') }]->(r27);


// facu_games
MATCH (u:Usuario { nombreUsuario: 'facu_games' })
MATCH (r1:Rutina { nombre: 'Rutina Fuerza Básica' })
MATCH (r2:Rutina { nombre: 'Rutina de Equilibrio y Estabilidad' })
MATCH (r3:Rutina { nombre: 'Rutina Flexibilidad Básica' })
WITH u, r1, r2, r3
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-20') }]->(r1)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-16'), fechaDeFin: date('2024-09-17') }]->(r2)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-17') }]->(r3);




// evelyn_yoga
MATCH (u:Usuario { nombreUsuario: 'evelyn_yoga' })
MATCH (r4:Rutina { nombre: 'Rutina de Estiramientos Activos' })
MATCH (r5:Rutina { nombre: 'Rutina Resistencia Total' })
MATCH (r6:Rutina { nombre: 'Rutina Flexibilidad Básica' })
MATCH (r7:Rutina { nombre: 'Rutina Resistencia Total' })
WITH u, r4, r5, r6, r7
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-12') }]->(r4)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-14') }]->(r5)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15') }]->(r7)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-20') }]->(r6);

// nicolas_swim
MATCH (u:Usuario { nombreUsuario: 'nicolas_swim' })
MATCH (r7:Rutina { nombre: 'Rutina de Acondicionamiento General' })
MATCH (r8:Rutina { nombre: 'Rutina Cardio Intensa' })
WITH u, r7, r8
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r7)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-12'), fechaDeFin: date('2024-09-25') }]->(r8);

// sofia_runner
MATCH (u:Usuario { nombreUsuario: 'sofia_runner' })
MATCH (r9:Rutina { nombre: 'Rutina Funcional Intermedia' })
MATCH (r10:Rutina { nombre: 'Rutina de Core Avanzado' })
MATCH (r11:Rutina { nombre: 'Rutina de Resistencia Cardiovascular' })
WITH u, r9, r10, r11
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r9)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-30') }]->(r10)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-25') }]->(r11);

// martin_lifter
MATCH (u:Usuario { nombreUsuario: 'martin_lifter' })
MATCH (r12:Rutina { nombre: 'Rutina Funcional Intermedia' })
MATCH (r13:Rutina { nombre: 'Rutina de Potencia Explosiva' })
MATCH (r14:Rutina { nombre: 'Rutina de Core Avanzado' })
WITH u, r12, r13, r14
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r12)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-12') }]->(r13)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-20'), fechaDeFin: date('2024-10-05') }]->(r14);

// luis_cyclist
MATCH (u:Usuario { nombreUsuario: 'luis_cyclist' })
MATCH (r15:Rutina { nombre: 'Rutina Cardio Intensa' })
MATCH (r16:Rutina { nombre: 'Rutina Piernas de Acero' })
WITH u, r15, r16
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-12') }]->(r15)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-20') }]->(r16);

// andrea_tennis
MATCH (u:Usuario { nombreUsuario: 'andrea_tennis' })
MATCH (r17:Rutina { nombre: 'Rutina de Resistencia Cardiovascular' })
MATCH (r18:Rutina { nombre: 'Rutina Resistencia Total' })
WITH u, r17, r18
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r17)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-30') }]->(r18);

// carlos_fit
MATCH (u:Usuario { nombreUsuario: 'carlos_fit' })
MATCH (r19:Rutina { nombre: 'Rutina Funcional Intermedia' })
MATCH (r20:Rutina { nombre: 'Rutina de Movilidad Articular' })
MATCH (r21:Rutina { nombre: 'Rutina Core y Abdomen' })
WITH u, r19, r20, r21
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r19)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-12') }]->(r20)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-20') }]->(r21);

// ana_climb
MATCH (u:Usuario { nombreUsuario: 'ana_climb' })
MATCH (r22:Rutina { nombre: 'Rutina Fuerza Básica' })
MATCH (r23:Rutina { nombre: 'Rutina de Movilidad Articular' })
WITH u, r22, r23
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-12') }]->(r22)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-25') }]->(r23);

// julian_marathon
MATCH (u:Usuario { nombreUsuario: 'julian_marathon' })
MATCH (r24:Rutina { nombre: 'Rutina HIIT Express' })
MATCH (r25:Rutina { nombre: 'Rutina de Hipertrofia Muscular' })
WITH u, r24, r25
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r24)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15') }]->(r25);

// laura_gym
MATCH (u:Usuario { nombreUsuario: 'laura_gym' })
MATCH (r26:Rutina { nombre: 'Rutina de Equilibrio y Estabilidad' })
MATCH (r27:Rutina { nombre: 'Rutina HIIT Express' })
WITH u, r26, r27
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-10') }]->(r26)
CREATE (u)-[:REALIZA_RUTINA { fechaDeComienzo: date('2024-09-15'), fechaDeFin: date('2024-09-30') }]->(r27);
