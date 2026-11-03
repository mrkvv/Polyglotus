package polyglotus.dictionary_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import polyglotus.dictionary_service.service.PhraseService;

import java.util.Map;

@RestController
@RequestMapping("/phrase")
public class PhraseController {

    private final PhraseService phraseService;

    public PhraseController(PhraseService phraseService) {
        this.phraseService = phraseService;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getPhrase() {
        return ResponseEntity.ok(
                Map.of("phrase", phraseService.getPhrase())
        );
    }
}
