package polyglotus.training_service.model;

import polyglotus.training_service.exception.IncorrectTranslationLanguageException;
import polyglotus.training_service.exception.NoTranslationLanguageProvidedException;

public enum TranslationDirection {
    EN("en"), RU("ru");

    private final String code;

    TranslationDirection(String code) {
        this.code = code;
    }

    public static TranslationDirection fromString(String language) {
        if(language == null || language.isBlank()) {
            throw new NoTranslationLanguageProvidedException();
        }

        String formatted = language.strip().toLowerCase();
        for (TranslationDirection direction : values()) {
            if (direction.code.equals(formatted)) {
                return direction;
            }
        }
        throw new IncorrectTranslationLanguageException(language);
    }
}
