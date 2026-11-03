package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class IncorrectPageSizeException extends ApiException {
    public IncorrectPageSizeException(Integer size) {
        super(
                "Page size must be positive and not bigger than 100. Entered page size: " + size,
                "INCORRECT_PAGE_SIZE",
                HttpStatus.BAD_REQUEST
        );
    }
}
