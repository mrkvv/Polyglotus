package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class NoStatusProvidedException extends ApiException {
    public NoStatusProvidedException() {
        super(
                "No status provided. Status can be 'LEARNED' or 'UNLEARNED'",
                "NO_STATUS_PROVIDED",
                HttpStatus.BAD_REQUEST
        );
    }
}
