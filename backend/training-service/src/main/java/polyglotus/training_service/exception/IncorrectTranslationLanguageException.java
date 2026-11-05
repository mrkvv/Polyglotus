package polyglotus.training_service.exception;

import org.springframework.http.HttpStatus;

public class IncorrectTranslationLanguageException extends ApiException {
    public IncorrectTranslationLanguageException(String translationLanguage) {
        super(
                "Incorrect query param 'to' was provided. Possible variants: 'ru', 'en'. " +
                        "Provided: " + translationLanguage,
                "INCORRECT_TRANSLATION_LANGUAGE",
                HttpStatus.BAD_REQUEST
        );
    }
}
