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
    
        try {
            NominatimResponse response = restTemplate.getForObject(url, NominatimResponse.class);
            if (response != null && response.getDisplay_name() != null) {
                return response.getDisplay_name();
            } else {
                throw new RuntimeException("La respuesta de Nominatim no contiene el campo 'display_name'");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener la ubicación: " + e.getMessage(), e);
        }
    }
    
    public String getCityAndCountry(double latitude, double longitude) {
        String url = String.format("https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=json", latitude, longitude);
    
        try {
            // Llamada al servicio
            NominatimResponse response = restTemplate.getForObject(url, NominatimResponse.class);
    
            if (response != null && response.getCityAndCountry() != null) {
                // Obtener "city, country"
                return response.getCityAndCountry();
            } else {
                throw new RuntimeException("No se obtuvo una respuesta válida de Nominatim.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener la ubicación: " + e.getMessage(), e);
        }
    }
    
}
