package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import unpsjb.labprog.backend.model.NominatimResponse;

@Service
public class LocationService {

    @Autowired
    private RestTemplate restTemplate;

    public String getDisplayName(double latitude, double longitude) {
        String url = String.format("https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=json", latitude, longitude);
        
        // Realizar la solicitud
        NominatimResponse response = restTemplate.getForObject(url, NominatimResponse.class);

        // Verificar si la respuesta es nula y manejar el caso
        if (response != null) {
            return response.getDisplay_name();  // Retorna el display_name del JSON
        } else {
            throw new RuntimeException("No se pudo obtener la ubicación");
        }
    }
}

