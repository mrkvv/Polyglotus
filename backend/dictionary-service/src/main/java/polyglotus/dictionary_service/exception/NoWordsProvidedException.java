package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class NoWordsProvidedException extends ApiException {
    public NoWordsProvidedException() {
        super(
                "Both en and ru words must be provided and not be blank.",
                "NO_WORDS_PROVIDED",
                HttpStatus.BAD_REQUEST
        );
    }
}
