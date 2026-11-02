package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class NoSuchStatusException extends ApiException {
    public NoSuchStatusException(String status) {
        super(
                "Status must be either 'LEARNED' or 'UNLEARNED'. Entered status: " + status,
                "NO_SUCH_STATUS",
                HttpStatus.BAD_REQUEST
        );
    }
}
