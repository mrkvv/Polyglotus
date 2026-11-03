package polyglotus.dictionary_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import polyglotus.dictionary_service.dto.response.TranslationsResponse;
import polyglotus.dictionary_service.service.TranslationService;


@RestController
@RequestMapping("/translations")
public class TranslationsController {

    private static final String X_USER_ID_HEADER = "X-User-Id";

    private final TranslationService translationService;

    public TranslationsController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @GetMapping
    public ResponseEntity<TranslationsResponse> getTranslations(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @RequestParam("word") String word
    ) {
        return ResponseEntity.ok(translationService.getTranslations(userId, word));
    }
}
