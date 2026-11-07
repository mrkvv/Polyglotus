package polyglotus.ai_service.service;

import org.springframework.stereotype.Service;
import polyglotus.ai_service.exception.NoMessageProvidedException;
import polyglotus.ai_service.exception.TooBigMessageException;

@Service
public class ValidationService {

    private static final String WORD_PLACEHOLDER = "______";
    private static final int SENTENCE_MAX_WORDS = 30;
    private static final int SENTENCE_MIN_WORDS = 4;


    public boolean isGeneratedSentenceCorrect(String sentence, String word) {
        if(sentence == null
                || sentence.isBlank()
                || !sentence.contains(WORD_PLACEHOLDER)
                || sentence.toLowerCase().contains(word.toLowerCase())
        ) {
            return false;
        }

        int wordCount = sentence.split("\\s+").length;
        return wordCount >= SENTENCE_MIN_WORDS && wordCount <= SENTENCE_MAX_WORDS;
    }

    public void validateMessage(String message) {
        if(message == null || message.isBlank()) {
            throw new NoMessageProvidedException();
        }
        if(message.length() > 256) {
            throw new TooBigMessageException(message);
        }
    }
}
