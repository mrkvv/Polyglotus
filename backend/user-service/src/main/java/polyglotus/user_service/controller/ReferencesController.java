package polyglotus.user_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import polyglotus.user_service.dto.response.ReferencesResponse;
import polyglotus.user_service.service.ReferenceService;

@RestController
@RequestMapping("/references")
public class ReferencesController {

    private final ReferenceService referenceService;

    public ReferencesController(ReferenceService referenceService) {
        this.referenceService = referenceService;
    }

    @GetMapping
    public ResponseEntity<ReferencesResponse> getReferences() {
        return ResponseEntity.ok(referenceService.getReferences());
    }
}
