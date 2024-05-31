package unpsjb.labprog.backend.business.validar;

import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;

public abstract class ValidadorParteMO {

    public abstract void validar(ResumenParteMO resPMO, ParteMO parteMO);

}

