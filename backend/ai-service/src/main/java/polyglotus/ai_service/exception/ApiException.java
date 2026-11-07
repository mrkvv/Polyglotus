package polyglotus.ai_service.exception;

import org.springframework.http.HttpStatus;

public abstract class ApiException extends RuntimeException {
    private final String code;
    private final HttpStatus httpStatus;

    public ApiException(String message, String code, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
