package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class InvalidAlphabetException extends ApiException {
    public InvalidAlphabetException(String word) {
        super(
                "Word: '" + word + "' contains characters not allowed for this language.",
                "INVALID_ALPHABET",
                HttpStatus.BAD_REQUEST
        );
    }
}
