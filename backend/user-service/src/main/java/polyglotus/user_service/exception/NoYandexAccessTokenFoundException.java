package polyglotus.user_service.exception;

import org.springframework.http.HttpStatus;

public class NoYandexAccessTokenFoundException extends ApiException {
    public NoYandexAccessTokenFoundException() {
        super(
                "No access token from Yandex",
                "NO_YANDEX_ACCESS_TOKEN_FOUND",
                HttpStatus.BAD_REQUEST
        );
    }
}
