package polyglotus.dictionary_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import polyglotus.dictionary_service.dto.DailyWord;
import polyglotus.dictionary_service.repository.WordRepository;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class DailyWordService {

    private static final String DEFAULT_WORD = "circumstance";

    private final WordRepository wordRepository;

    public DailyWordService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Transactional
    public DailyWord getDailyWord() {
        Optional<Map<String, Object>> dailyWord = wordRepository.getDailyWord();
        return dailyWord.map(DailyWord::fromMap)
                .orElseGet(this::generateAndGetDailyWord);
    }

    private DailyWord generateAndGetDailyWord() {
        Integer wordsInTotal = wordRepository.getTotalAmountOfWords();
        if(wordsInTotal == null || wordsInTotal == 0) {
            return new DailyWord(DEFAULT_WORD, LocalDate.now().toString());
        }

        int randomWordId = ThreadLocalRandom.current().nextInt(1, wordsInTotal + 1);
        wordRepository.insertDailyWord(randomWordId);

        Optional<Map<String, Object>> insertedDailyWord = wordRepository.getDailyWord();
        return DailyWord.fromMap(insertedDailyWord.get());
    }
}
