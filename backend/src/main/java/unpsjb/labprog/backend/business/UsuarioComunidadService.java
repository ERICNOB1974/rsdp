package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Usuario;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Service
public class UsuarioComunidadService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ComunidadRepository comunidadRepository;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private LocationService locationService;

    public String solicitarIngreso(Long idUsuario, Long idComunidad) throws Exception {
        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (usuarioOpt.isEmpty()) {
            throw new Exception("El usuario no existe.");
        }
        Comunidad comunidad = comunidadOpt.get();
        Usuario usuario = usuarioOpt.get();

        // Verificar si el usuario ya es miembro de la comunidad
        if (usuarioRepository.esMiembro(idUsuario, idComunidad)) {
            throw new Exception("El usuario ya es miembro de la comunidad.");
        }
        if (!comunidad.isEsPrivada()) {
            // Si la comunidad es pública, agregar directamente al usuario como miembro
            comunidadRepository.nuevoMiembro(comunidad.getId(), usuario.getId(), LocalDateTime.now());
            notificacionService.crearNotificacion(idUsuario, idComunidad, "UNION_PUBLICA", LocalDateTime.now());
            return "Usuario ingresado en la comunidad correctamente"; // Finalizar aquí si la comunidad es pública
        }

        // Verificar si ya existe una solicitud de ingreso pendiente o enviada
        if (usuarioRepository.solicitudIngresoExiste(idUsuario, idComunidad)) {
            throw new Exception("Ya existe una solicitud de ingreso para la comunidad: "+ comunidad.getNombre());
        }
        usuarioRepository.enviarSolicitudIngreso(idUsuario, idComunidad, "pendiente", LocalDateTime.now());
        return "Solicitud de ingreso a la comunidad: "+comunidad.getNombre()+" enviada correctamente";
    }

      public String eliminarSolicitudIngreso(Long idUsuario, Long idComunidad) throws Exception {
        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (usuarioOpt.isEmpty()) {
            throw new Exception("El usuario no existe.");
        }
        Comunidad comunidad = comunidadOpt.get();
            // Verificar si ya existe una solicitud de ingreso pendiente o enviada
        if (!usuarioRepository.solicitudIngresoExiste(idUsuario, idComunidad)) {
            throw new Exception("No existe una solicitud de ingreso para la comunidad: "+ comunidad.getNombre());
        }
        comunidadRepository.eliminarSolicitudIngreso(idUsuario, idComunidad);
        return "Solicitud de ingreso a la comunidad: "+comunidad.getNombre()+" eliminada correctamente";
    }


    public String otorgarRolAdministrador(Long idCreador, Long idMiembro, Long idComunidad) throws Exception {
        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }
        Optional<Usuario> creadorOpt = usuarioRepository.findById(idCreador);
        if (creadorOpt.isEmpty()) {
            throw new Exception("El usuario dueño de la comunidad no existe.");
        }

        Optional<Usuario> miembroOpt = usuarioRepository.findById(idMiembro);
        if (miembroOpt.isEmpty()) {
            throw new Exception("El usuario al que se le quiere asignar el rol administrador no existe.");
        }
        Usuario usuario = miembroOpt.get();

        // Verificar si el usuario es miembro de la comunidad
        if (!usuarioRepository.esMiembro(idMiembro, idComunidad) && !usuarioRepository.esModerador(idMiembro, idComunidad)) {
            throw new Exception("El usuario al que se le quiere asignar el rol no es miembro de la comunidad.");
        }

        // Verificar si el usuario no posee ya el rol administrador
        if (usuarioRepository.esAdministrador(idMiembro, idComunidad)) {
            throw new Exception("El usuario al que se le quiere asignar el rol ya es administrador.");
        }

        // Verificar si el usuario que quiere otorgar rol es el dueño de la comunidad
        if (!usuarioRepository.esCreador(idCreador, idComunidad)) {
            throw new Exception("No posee los permisos para otorgar el rol");
        }
        LocalDateTime fechaIngreso = comunidadRepository.obtenerFechaIngreso(idMiembro, idComunidad);
        if (fechaIngreso == null) {
            throw new Exception("No se pudo obtener la fecha de ingreso.");
        }

        if(usuarioRepository.esModerador(idMiembro,idComunidad)){
            quitarRolModerador(idCreador, idMiembro, idComunidad);
        }
        comunidadRepository.otorgarRolAdministrador(idMiembro, idComunidad, fechaIngreso, LocalDateTime.now());
        return "Rol administrador otorgado a: " + usuario.getNombreUsuario() + " correctamente";
    }

    public String quitarRolAdministrador(Long idCreador, Long idAdministrador, Long idComunidad) throws Exception {
        // Verificar la existencia de la comunidad
        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }

        // Verificar la existencia del creador
        Optional<Usuario> creadorOpt = usuarioRepository.findById(idCreador);
        if (creadorOpt.isEmpty()) {
            throw new Exception("El usuario creador no existe.");
        }

        // Verificar la existencia del administrador
        Optional<Usuario> miembroOpt = usuarioRepository.findById(idAdministrador);
        if (miembroOpt.isEmpty()) {
            throw new Exception("El usuario administrador no existe.");
        }
        Usuario usuario = miembroOpt.get();

        // Verificar permisos
        if (!usuarioRepository.esCreador(idCreador, idComunidad)) {
            throw new Exception("No posee los permisos para otorgar el rol.");
        }

        // Verificar si el usuario es realmente un administrador
        if (!usuarioRepository.esAdministrador(idAdministrador, idComunidad)) {
            throw new Exception("El usuario al que se le quiere quitar el rol no es administrador.");
        }

        // Obtener la fecha de ingreso
        LocalDateTime fechaIngreso = comunidadRepository.obtenerFechaIngreso(idAdministrador, idComunidad);
        if (fechaIngreso == null) {
            throw new Exception("No se pudo obtener la fecha de ingreso del administrador.");
        }

        // Realizar la operación en la base de datos
        comunidadRepository.quitarRolAdministrador(idAdministrador, idComunidad, fechaIngreso);

        return "Rol administrador quitado a: " + usuario.getNombreUsuario() + " correctamente.";
    }

    public Comunidad guardarComunidadYCreador(Comunidad comunidad, Long idUsuario) throws Exception {
        String ubicacion = locationService.getCityAndCountry(comunidad.getLatitud(), comunidad.getLongitud());

        comunidad.setUbicacion(ubicacion);

        Optional<Usuario> miembroOpt = usuarioRepository.findById(idUsuario);
        if (miembroOpt.isEmpty()) {
            throw new Exception("El usuario no existe.");
        }
        comunidad.setFechaDeCreacion(LocalDate.now()); // Establece la fecha aquí
        return comunidadRepository.guardarComunidadYCreador(comunidad.getNombre(), comunidad.getGenero(), comunidad.getDescripcion(),
                comunidad.getCantidadMaximaMiembros(), comunidad.isEsPrivada(), comunidad.isEsModerada(), idUsuario,
                comunidad.getFechaDeCreacion(), comunidad.getLatitud(), comunidad.getLongitud(), comunidad.getImagen(), comunidad.getUbicacion());
    }

    public String gestionarSolicitudes(Long idSuperUsuario, Long idUsuario, Long idComunidad, boolean aceptar)
            throws Exception {
        Optional<Usuario> miembroOpt = usuarioRepository.findById(idUsuario);
        if (miembroOpt.isEmpty()) {
            throw new Exception("El usuario no existe.");
        }
        Optional<Usuario> superUsuario = usuarioRepository.findById(idSuperUsuario);
        if (superUsuario.isEmpty()) {
            throw new Exception("El usuario con permisos no existe.");
        }

        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }
        Comunidad comunidad = comunidadOpt.get();
        if (!usuarioRepository.solicitudIngresoExiste(idUsuario, idComunidad)) {
            throw new Exception("No hay solicitud de ingreso pendiente");
        }
        if ((!usuarioRepository.esCreador(idSuperUsuario, idComunidad))
                && (!usuarioRepository.esAdministrador(idSuperUsuario, idComunidad))) {
            throw new Exception("Este usuario no puede gestionar solicitudes");
        }
        if (!aceptar) {
            comunidadRepository.eliminarSolicitudIngreso(idUsuario, idComunidad);
            return "Solicitud de ingreso rechazada correctamente";
        }
        if (!(comunidadRepository.cantidadUsuarios(idComunidad) < comunidad.getCantidadMaximaMiembros())) {
            throw new Exception("La comunidad esta llena");
        }
        comunidadRepository.eliminarSolicitudIngreso(idUsuario, idComunidad);
        comunidadRepository.nuevoMiembro(idComunidad, idUsuario, LocalDateTime.now());
        notificacionService.crearNotificacion(idUsuario, idComunidad, "ACEPTACION_PRIVADA", LocalDateTime.now());

        return "Solicitud de ingreso aceptada correctamente";
    }

    public String eliminarUsuario(Long idSuperUsuario, Long idUsuario, Long idComunidad)
            throws Exception {
        Optional<Usuario> miembroOpt = usuarioRepository.findById(idUsuario);
        if (miembroOpt.isEmpty()) {
            throw new Exception("El usuario no existe.");
        }
        Optional<Usuario> superUsuario = usuarioRepository.findById(idSuperUsuario);
        if (superUsuario.isEmpty()) {
            throw new Exception("El usuario con permisos no existe.");
        }

        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }
        if (!usuarioRepository.esMiembro(idUsuario, idComunidad)) {
            throw new Exception("El usuario no es miembro de la comunidad");
        }
        if ((!usuarioRepository.esCreador(idSuperUsuario, idComunidad))
                && (!usuarioRepository.esAdministrador(idSuperUsuario, idComunidad))) {
            throw new Exception("Este usuario no puede gestionar solicitudes");
        }

        comunidadRepository.eliminarUsuario(idUsuario, idComunidad);

        return "Miembro eliminado de la comunidad correctamente";
    }

    public List<Usuario> visualizarSolicitudes(Long idSuperUsuario, Long idComunidad, String term, int page, int size) throws Exception {

        Optional<Usuario> superUsuario = usuarioRepository.findById(idSuperUsuario);
        if (superUsuario.isEmpty()) {
            throw new Exception("El usuario con permisos no existe.");
        }

        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }

        if ((!usuarioRepository.esCreador(idSuperUsuario, idComunidad))
                && (!usuarioRepository.esAdministrador(idSuperUsuario, idComunidad))) {
            throw new Exception("Este usuario no puede gestionar solicitudes");
        }
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (term == null || term.trim().isEmpty()) ? "" : term;

        return usuarioRepository.solicititudesPendientesPaginadas(idComunidad,filtroNombre, skip, size);
    }

        public List<Usuario> obtenerExpulsadosActivos(Long idSuperUsuario, Long idComunidad, String term, int page, int size) throws Exception {

        Optional<Usuario> superUsuario = usuarioRepository.findById(idSuperUsuario);
        if (superUsuario.isEmpty()) {
            throw new Exception("El usuario con permisos no existe.");
        }

        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }

        if ((!usuarioRepository.esCreador(idSuperUsuario, idComunidad))
                && (!usuarioRepository.esAdministrador(idSuperUsuario, idComunidad))) {
            throw new Exception("Este usuario no puede gestionar solicitudes");
        }
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (term == null || term.trim().isEmpty()) ? "" : term;

        return usuarioRepository.obtenerExpulsadosActivos(idComunidad,filtroNombre, skip, size);
    }


    public String verEstado(Long idComunidad, Long idUsuario) {
        if (usuarioRepository.esCreador(idUsuario, idComunidad)) {
            return "Creador";
        }
        if (usuarioRepository.esAdministrador(idUsuario, idComunidad)) {
            return "Administrador";
        }
        if (usuarioRepository.esMiembro(idUsuario, idComunidad)) {
            return "Miembro";
        }
        if (usuarioRepository.solicitudIngresoExiste(idUsuario, idComunidad)) {
            return "Pendiente";
        }
        if (usuarioRepository.esModerador(idUsuario, idComunidad)) {
            return "Moderador";
        }
        return "Vacio";
    }

       public String otorgarRolModerador(Long idCreador, Long idMiembro, Long idComunidad) throws Exception {
        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }
        Optional<Usuario> creadorOpt = usuarioRepository.findById(idCreador);
        if (creadorOpt.isEmpty()) {
            throw new Exception("El usuario dueño de la comunidad no existe.");
        }

        Optional<Usuario> miembroOpt = usuarioRepository.findById(idMiembro);
        if (miembroOpt.isEmpty()) {
            throw new Exception("El usuario al que se le quiere asignar el rol administrador no existe.");
        }
        Usuario usuario = miembroOpt.get();

        // Verificar si el usuario es miembro de la comunidad
        if (!usuarioRepository.esMiembro(idMiembro, idComunidad) && !usuarioRepository.esAdministrador(idMiembro, idComunidad)) {
            throw new Exception("El usuario al que se le quiere asignar el rol no es miembro de la comunidad.");
        }

        // Verificar si el usuario no posee ya el rol administrador
        if (usuarioRepository.esModerador(idMiembro, idComunidad)) {
            throw new Exception("El usuario al que se le quiere asignar el rol ya es moderador.");
        }

        // Verificar si el usuario que quiere otorgar rol es el dueño de la comunidad
        if (!usuarioRepository.esCreador(idCreador, idComunidad)) {
            throw new Exception("No posee los permisos para otorgar el rol");
        }
        LocalDateTime fechaIngreso = comunidadRepository.obtenerFechaIngreso(idMiembro, idComunidad);
        if (fechaIngreso == null) {
            throw new Exception("No se pudo obtener la fecha de ingreso.");
        }
        comunidadRepository.otorgarRolModerador(idMiembro, idComunidad, fechaIngreso, LocalDateTime.now());
        return "Rol moderador otorgado a: " + usuario.getNombreUsuario() + " correctamente";
    }

    public String quitarRolModerador(Long idCreador, Long idAdministrador, Long idComunidad) throws Exception {
        // Verificar la existencia de la comunidad
        Optional<Comunidad> comunidadOpt = comunidadRepository.findById(idComunidad);
        if (comunidadOpt.isEmpty()) {
            throw new Exception("La comunidad no existe.");
        }

        // Verificar la existencia del creador
        Optional<Usuario> creadorOpt = usuarioRepository.findById(idCreador);
        if (creadorOpt.isEmpty()) {
            throw new Exception("El usuario creador no existe.");
        }

        // Verificar la existencia del administrador
        Optional<Usuario> miembroOpt = usuarioRepository.findById(idAdministrador);
        if (miembroOpt.isEmpty()) {
            throw new Exception("El usuario administrador no existe.");
        }
        Usuario usuario = miembroOpt.get();

        // Verificar permisos
        if (!usuarioRepository.esCreador(idCreador, idComunidad)) {
            throw new Exception("No posee los permisos para otorgar el rol.");
        }

        // Verificar si el usuario es realmente un administrador
        if (!usuarioRepository.esModerador(idAdministrador, idComunidad)) {
            throw new Exception("El usuario al que se le quiere quitar el rol no es moderador.");
        }

        // Obtener la fecha de ingreso
        LocalDateTime fechaIngreso = comunidadRepository.obtenerFechaIngreso(idAdministrador, idComunidad);
        if (fechaIngreso == null) {
            throw new Exception("No se pudo obtener la fecha de ingreso del moderador.");
        }

        // Realizar la operación en la base de datos

        comunidadRepository.quitarRolModerador(idAdministrador, idComunidad, fechaIngreso,LocalDateTime.now());

        return "Rol moderador quitado a: " + usuario.getNombreUsuario() + " correctamente.";
    }

}