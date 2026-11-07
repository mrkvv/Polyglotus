package polyglotus.ai_service.exception;

import org.springframework.http.HttpStatus;

public class NoMessageProvidedException extends ApiException {
    public NoMessageProvidedException() {
        super(
                "No message provided.",
                "NO_MESSAGE_PROVIDED",
                HttpStatus.BAD_REQUEST
        );
    }
}
