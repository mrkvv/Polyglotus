package polyglotus.dictionary_service.service;

import org.springframework.stereotype.Service;
import polyglotus.dictionary_service.exception.*;

import java.util.Set;

@Service
public class ValidationService {

    private static final Set<String> ALLOWED_PARTS_OF_SPEECH = Set.of(
            "noun", "verb", "modal_verb", "adjective", "adverb", "pronoun",
            "numeral", "numeral_fractional", "determiner", "interjection",
            "article", "preposition", "conjunction", "letter", "phrase",
            "grammar_pattern"
    );

    private static final int MAX_WORD_LENGTH = 30;

    public void validateWords(String ruWord, String enWord) {
        if(ruWord == null || enWord == null || ruWord.isBlank() || enWord.isBlank()) {
            throw new NoWordsProvidedException();
        }

        if(ruWord.length() > MAX_WORD_LENGTH || enWord.length() > MAX_WORD_LENGTH) {
            throw new WordsSizeLimitExceededException(ruWord, enWord, MAX_WORD_LENGTH);
        }
    }

    public void validatePartOfSpeech(String partOfSpeech) {
        if(partOfSpeech == null || partOfSpeech.isBlank()) {
            throw new NoPartOfSpeechProvidedException();
        }

        if(!ALLOWED_PARTS_OF_SPEECH.contains(partOfSpeech)) {
            throw new IncorrectPartOfSpeechException(ALLOWED_PARTS_OF_SPEECH, partOfSpeech);
        }
    }

    public void validateSize(Integer size) {
        if(size <= 0 || size > 100) {
            throw new IncorrectPageSizeException(size);
        }
    }

    public void validateWordStatus(String status) {
        if(status != null && !status.equals("LEARNED") && !status.equals("UNLEARNED")) {
            throw new NoSuchStatusException(status);
        }
    }

    public void validatePage(Integer page, Integer totalPages) {
        int maxPage = Math.max(totalPages - 1, 0);
        if(page < 0 || page > maxPage) {
            throw new NoSuchPageException(page, maxPage);
        }
    }
}
