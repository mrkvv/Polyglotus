package polyglotus.training_service.exception;

import org.springframework.http.HttpStatus;

public class NoTranslationLanguageProvidedException extends ApiException {
    public NoTranslationLanguageProvidedException() {
        super(
                "Query param 'to' not provided. Possible variants: 'ru', 'en'.",
                "NO_TRANSLATION_LANGUAGE_PROVIDED",
                HttpStatus.BAD_REQUEST
        );
    }
}
