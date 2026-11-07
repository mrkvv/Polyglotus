package polyglotus.ai_service.exception;

import org.springframework.http.HttpStatus;

public class TooBigMessageException extends ApiException {
    public TooBigMessageException(String message) {
        super(
                "Entered message is too big. Size: " + message.length() + "/256 symbols max.",
                "TOO_BIG_MESSAGE",
                HttpStatus.BAD_REQUEST
        );
    }
}
