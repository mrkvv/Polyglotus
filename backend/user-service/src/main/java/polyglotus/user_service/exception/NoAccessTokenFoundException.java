package polyglotus.user_service.exception;

import org.springframework.http.HttpStatus;

public class NoAccessTokenFoundException extends ApiException {
    public NoAccessTokenFoundException() {
        super(
                "No access token provided",
                "NO_ACCESS_TOKEN_FOUND",
                HttpStatus.UNAUTHORIZED
        );
    }
}
