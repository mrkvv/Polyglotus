package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class WordsSizeLimitExceededException extends ApiException {
    public WordsSizeLimitExceededException(String ruWord, String enWord, int limit) {
        super(
                "Entered words must be less or equal than " + limit + " symbols wide. Entered words: " +
                        ruWord + " (" + ruWord.length() + " symbols), " +
                        enWord + " (" + enWord.length() + " symbols)",
                "WORDS_SIZE_EXCEEDED",
                HttpStatus.BAD_REQUEST
        );
    }
}
