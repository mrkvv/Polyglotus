package polyglotus.training_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import polyglotus.training_service.dto.FillingTasksResponse;
import polyglotus.training_service.dto.MarkCorrectRequest;
import polyglotus.training_service.dto.MatchTask;
import polyglotus.training_service.dto.TranslationTask;
import polyglotus.training_service.service.MatchTaskService;
import polyglotus.training_service.service.SentenceFillingTaskService;
import polyglotus.training_service.service.TranslationTaskService;
import polyglotus.training_service.service.WordProgressService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/training")
public class TrainingController {

    private static final String USER_ID_HEADER = "X-User-Id";

    private static final String DEFAULT_AMOUNT_OF_TRANSLATION_TRAININGS = "5";
    private static final String DEFAULT_AMOUNT_OF_MATCH_TRAININGS = "3";
    private static final String DEFAULT_AMOUNT_OF_FILLING_TRAININGS = "3";

    private final TranslationTaskService translationTaskService;
    private final MatchTaskService matchTaskService;
    private final SentenceFillingTaskService sentenceFillingTaskService;
    private final WordProgressService wordProgressService;

    public TrainingController(TranslationTaskService translationTaskService,
                              MatchTaskService matchTaskService,
                              SentenceFillingTaskService sentenceFillingTaskService,
                              WordProgressService wordProgressService) {
        this.translationTaskService = translationTaskService;
        this.matchTaskService = matchTaskService;
        this.sentenceFillingTaskService = sentenceFillingTaskService;
        this.wordProgressService = wordProgressService;
    }

    @GetMapping("/translate")
    public ResponseEntity<Map<String, Object>> getTranslationTasks(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestParam String to,
            @RequestParam(defaultValue = DEFAULT_AMOUNT_OF_TRANSLATION_TRAININGS) Integer amount
    ) {
        List<TranslationTask> tasks = translationTaskService.buildTasks(id, amount, to);
        Map<String, Object> response = Map.of(
                "tasks", tasks,
                "amount", tasks.size()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/match")
    public ResponseEntity<Map<String, Object>> getMatchTasks(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestParam(defaultValue = DEFAULT_AMOUNT_OF_MATCH_TRAININGS) Integer amount
    ) {
        List<MatchTask> tasks = matchTaskService.getMatchTasks(id, amount);
        Map<String, Object> response = Map.of(
                "tasks", tasks,
                "amount", tasks.size()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/fill")
    public ResponseEntity<FillingTasksResponse> getFillingTasks(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestParam(defaultValue = DEFAULT_AMOUNT_OF_FILLING_TRAININGS) Integer amount
    ) {
        return ResponseEntity.ok(sentenceFillingTaskService.getFillingTasks(id, amount));
    }

    @PostMapping("/mark-correct")
    public ResponseEntity<Void> markWordsAsCorrectlyAnswered(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestBody MarkCorrectRequest request
    ) {
        wordProgressService.markCorrect(id, request.idsToMark());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
