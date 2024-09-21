UNWIND [
    "Running", "Ciclismo", "Natación", "Crossfit", "Yoga", "Hockey", "Trail Running", "Spinning", "Maratón",
    "Ciclismo de Montaña", "Atletismo", "Fútbol", "Básquetbol", "Voleibol", "Tenis", "Rugby", "Deportes Acuáticos",
    "Senderismo", "Esquí", "Snowboard", "Patinaje", "Remo", "Piragüismo", "Escalada", "Funcional",
    "Surf", "Windsurf", "Kitesurf", "Golf", "Boxeo", "Kickboxing", "Karate", "Judo", "De contacto",
    "Taekwondo", "Muay Thai", "Esgrima", "Tiro con Arco", "Gimnasia", "Triatlón", "Combate", "Duatlón",
    "Zumba", "Baile", "Ajedrez", "Squash", "Estrategia", "Parkour", "Escalada en Montaña","Escalada en Roca", "Motocross", "Automovilismo",
    "Enduro", "Playa","Stretching", "Carrera","Caminata", "Montaña", "Ciudad", "Ping Pong", "Bádminton", 
    "Levantamiento de Pesas", "Powerlifting", "Halcones", "Pádel", "Equitación", "Pesca Deportiva"
] AS deporte
CREATE (:Etiqueta { nombre: deporte });