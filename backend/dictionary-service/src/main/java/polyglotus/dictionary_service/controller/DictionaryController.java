package polyglotus.dictionary_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import polyglotus.dictionary_service.dto.DictionaryPage;
import polyglotus.dictionary_service.dto.request.AddWordRequest;
import polyglotus.dictionary_service.dto.Word;
import polyglotus.dictionary_service.dto.request.BatchDeleteRequest;
import polyglotus.dictionary_service.dto.request.ChangeWordStatusRequest;
import polyglotus.dictionary_service.service.DictionaryService;

@RestController
@RequestMapping("/dictionary")
public class DictionaryController {

    private static final String X_USER_ID_HEADER = "X-User-Id";

    private final DictionaryService dictionaryService;

    public DictionaryController(DictionaryService dictionaryService) {
        this.dictionaryService = dictionaryService;
    }

    @GetMapping
    public ResponseEntity<DictionaryPage> getDictionary(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(dictionaryService.getPage(userId, page, size, status));
    }

    @PostMapping("/words")
    public ResponseEntity<Word> addWord(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @RequestBody AddWordRequest request
    ) {
        String enWord = request.en();
        String ruWord = request.ru();
        String partOfSpeech = request.partOfSpeech();

        Word addedWord = dictionaryService.addWord(userId, enWord, ruWord, partOfSpeech);

        return ResponseEntity.status(HttpStatus.CREATED)
                        .body(addedWord);
    }

    @DeleteMapping("/words/{id}")
    public ResponseEntity<Void> deleteWord(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @PathVariable("id") Integer wordId
    ) {
        dictionaryService.deleteWord(userId, wordId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/words")
    public ResponseEntity<Void> deleteWordsBatch(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @RequestBody BatchDeleteRequest request
    ) {
        dictionaryService.deleteWordsBatch(userId, request.wordIds());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/words/status/{id}")
    public ResponseEntity<Word> changeWordStatus(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @PathVariable("id") Integer wordId,
            @RequestBody ChangeWordStatusRequest request
    ) {
        return ResponseEntity.ok(dictionaryService.setWordStatus(userId, wordId, request.status()));
    }

    @PatchMapping("/words/status")
    public ResponseEntity<Void> changeWordsStatusBatch(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @RequestBody ChangeWordStatusRequest request
    ) {
        dictionaryService.setWordsStatusBatch(userId, request.wordIds(), request.status());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/words/{id}")
    public ResponseEntity<Word> editWord(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @PathVariable("id") Integer wordId,
            @RequestBody AddWordRequest request
    ) {
        return ResponseEntity.ok(
                dictionaryService.editWord(userId, wordId,
                        request.ru(), request.en(), request.partOfSpeech()
                )
        );
    }
}
