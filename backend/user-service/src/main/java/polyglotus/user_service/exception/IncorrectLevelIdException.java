package polyglotus.user_service.exception;

import org.springframework.http.HttpStatus;

public class IncorrectLevelIdException extends ApiException {

    private static final String NO_LEVEL_ID_PROVIDED_MESSAGE = "No levelId provided";
    private static final String LEVEL_ID_DO_NOT_EXIST_MESSAGE = "Entered levelId do not exist. Entered levelId: ";

    public IncorrectLevelIdException(Integer levelId) {
        super(
                levelId == null
                        ? NO_LEVEL_ID_PROVIDED_MESSAGE
                        : LEVEL_ID_DO_NOT_EXIST_MESSAGE + levelId,
                "INCORRECT_LEVEL_ID",
                HttpStatus.BAD_REQUEST
        );
    }
}
