MATCH (u:Usuario), (e:Evento)
WHERE rand() < 0.1 AND NOT e.esPrivadoParaLaComunidad
CREATE (u)-[p:PARTICIPA_EN {
  fechaDeInscripcion: date()
  }]->(e);