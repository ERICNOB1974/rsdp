UNWIND [
"Running", "Ciclismo", "Natación", "Crossfit", "Yoga", "Hockey", "Trail Running", "Spinning", "Maratón",
"Ciclismo de Montaña", "Atletismo", "Fútbol", "Básquetbol", "Voleibol", "Tenis", "Rugby",
"Senderismo", "Esquí", "Snowboard", "Patinaje", "Remo", "Piragüismo", "Escalada",
"Surf", "Windsurf", "Kitesurf", "Golf", "Boxeo", "Kickboxing", "Karate", "Judo",
"Taekwondo", "Muay Thai", "Esgrima", "Tiro con Arco", "Gimnasia", "Triatlón", "Duatlón",
"Zumba", "Baile", "Ajedrez", "Squash", "Bádminton", "Parkour", "Escalada en Roca", "Motocross", "Automovilismo",
"Enduro", "Levantamiento de Pesas", "Powerlifting", "Halcones", "Pádel", "Equitación", "Pesca Deportiva"
] AS deporte
CREATE (:Etiqueta { nombre: deporte });