package unpsjb.labprog.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public class NominatimResponse {

    private String display_name;
    private Address address;

    // Getter y Sette
    public String getDisplay_name() {
        return display_name;
    }

    public void setDisplay_name(String display_name) {
        this.display_name = display_name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Address {
        private String city;
        private String country;

        // Getters y setters
        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }
    }

    // Nuevo método: "city, country"
    public String getCityAndCountry() {
        if (address != null) {
            String city = address.getCity();
            String country = address.getCountry();

            if (city != null && country != null) {
                return city + ", " + country;
            } else if (city != null) {
                return city; // Si solo existe city
            } else if (country != null) {
                return country; // Si solo existe country
            }
        }
        return "Ubicación desconocida"; // Manejo de casos donde no hay datos
    }


}
