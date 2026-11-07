package polyglotus.ai_service.exception.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import polyglotus.ai_service.exception.ApiException;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, String>> handle(ApiException ex) {
        return ResponseEntity.status(ex.getHttpStatus())
                .body(formResponseBody(ex));
    }

    private Map<String, String> formResponseBody(ApiException ex) {
        return Map.of(
                "message", ex.getMessage(),
                "error", ex.getCode()
        );
    }
}
