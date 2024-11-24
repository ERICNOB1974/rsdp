package unpsjb.labprog.backend.business;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

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

    public String getCityAndCountry(double latitude, double longitude) {
        String url = String.format("https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=json", latitude, longitude);
        
        // Realizar la solicitud
        NominatimResponse response = restTemplate.getForObject(url, NominatimResponse.class);

        if (response != null && response.getAddress() != null) {
            // Usar ObjectMapper para convertir el string address a un Map
            ObjectMapper mapper = new ObjectMapper();
            try {
                Map<String, String> addressMap = mapper.readValue(response.getAddress(), Map.class);

                // Extraer ciudad y país del mapa
                String city = addressMap.getOrDefault("city","Ciudad desconocida");

                String country = addressMap.getOrDefault("country", "País desconocido");

                return String.format("%s, %s", city, country);
            } catch (Exception e) {
                throw new RuntimeException("Error al procesar la dirección", e);
            }
        } else {
            throw new RuntimeException("No se pudo obtener la ubicación");
        }
    }

}
