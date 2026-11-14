package polyglotus.user_service.exception;

import org.springframework.http.HttpStatus;

public class IncorrectThemeIdException extends ApiException {
    private static final String NO_THEME_ID_PROVIDED_MESSAGE = "No themeId provided";
    private static final String THEME_ID_DO_NOT_EXIST_MESSAGE = "Entered themeId do not exist. Entered themeId: ";

    public IncorrectThemeIdException(Integer themeId) {
        super(
                themeId == null
                        ? NO_THEME_ID_PROVIDED_MESSAGE
                        : THEME_ID_DO_NOT_EXIST_MESSAGE + themeId,
                "INCORRECT_THEME_ID",
                HttpStatus.BAD_REQUEST
        );
    }
}
