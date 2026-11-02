package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class NoSuchPageException extends ApiException {
    public NoSuchPageException(Integer page, Integer totalPages) {
        super(
                "Page " + page + " doesn't exist. Available pages: 0.." + totalPages,
                "NO_SUCH_PAGE",
                HttpStatus.BAD_REQUEST
        );
    }
}
