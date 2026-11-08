package polyglotus.training_service.exception;

import org.springframework.http.HttpStatus;

public class AiServiceUnavailableException extends ApiException {
    public AiServiceUnavailableException() {
        super(
                "AiService is temporarily unavailable. Please try again later.",
                "AI_SERVICE_UNAVAILABLE",
                HttpStatus.SERVICE_UNAVAILABLE
        );
    }

    public AiServiceUnavailableException(Throwable cause) {
        super(
                "AiService is temporarily unavailable. Please try again later. Cause: "
                        + (cause != null && cause.getMessage() != null ? cause.getMessage() : "unknown"),
                "AI_SERVICE_UNAVAILABLE",
                HttpStatus.SERVICE_UNAVAILABLE
        );
    }
}
