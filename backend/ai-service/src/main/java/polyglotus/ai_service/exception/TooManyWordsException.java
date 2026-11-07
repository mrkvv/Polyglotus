package polyglotus.ai_service.exception;

import org.springframework.http.HttpStatus;

public class TooManyWordsException extends ApiException {
    public TooManyWordsException(int maxWords, int wordsProvided) {
        super(
                String.format("Too many words. Maximum allowed is %d, but %d were provided.",
                        maxWords, wordsProvided),
                "TOO_MANY_WORDS",
                HttpStatus.BAD_REQUEST
        );
    }
}
