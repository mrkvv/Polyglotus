package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class WordNotFoundException extends ApiException {
    public WordNotFoundException(Integer userId) {
        super(
                "User with id '" + userId + "' do not have this word in his dictionary",
                "WORD_NOT_FOUND",
                HttpStatus.NOT_FOUND
        );
    }
}
