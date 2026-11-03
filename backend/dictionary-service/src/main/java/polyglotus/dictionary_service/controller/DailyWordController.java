package polyglotus.dictionary_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import polyglotus.dictionary_service.dto.DailyWord;
import polyglotus.dictionary_service.service.DailyWordService;

@RestController
@RequestMapping("/daily-word")
public class DailyWordController {

    private final DailyWordService dailyWordService;

    public DailyWordController(DailyWordService dailyWordService) {
        this.dailyWordService = dailyWordService;
    }

    @GetMapping
    public ResponseEntity<DailyWord> getDailyWord() {
        return ResponseEntity.ok(dailyWordService.getDailyWord());
    }
}
