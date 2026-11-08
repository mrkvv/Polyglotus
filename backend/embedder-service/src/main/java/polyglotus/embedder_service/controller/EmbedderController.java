package polyglotus.embedder_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import polyglotus.embedder_service.dto.GetTopKRequest;
import polyglotus.embedder_service.dto.GetTopKResponse;
import polyglotus.embedder_service.service.EmbedderService;

@RestController
@RequestMapping("/embedder")
public class EmbedderController {
    private final EmbedderService embedderService;

    public EmbedderController(EmbedderService embedderService) {
        this.embedderService = embedderService;
    }

    @PostMapping("/topk")
    public ResponseEntity<GetTopKResponse> getTopK(
            @RequestBody GetTopKRequest request
    ) {
        return ResponseEntity.ok(embedderService.getTopK(request));
    }
}
