package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.business.LocationService;

@RestController
@RequestMapping("/location")
public class LocationPresenter {

    @Autowired
    private LocationService locationService;

    @GetMapping("/reverse/{lat}/{lon}")
    public ResponseEntity<String> reverseGeocode(@PathVariable double lat, @PathVariable double lon) {
        String displayName = locationService.getDisplayName(lat, lon);
        return ResponseEntity.ok(displayName);  // Devuelve el display_name
    }
}
