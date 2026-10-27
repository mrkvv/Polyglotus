package polyglotus.user_service.exception;

import org.springframework.http.HttpStatus;

public class IncorrectAvatarIdException extends ApiException{

    private static final String NO_AVATAR_ID_PROVIDED_MESSAGE = "No avatarId provided";
    private static final String AVATAR_ID_DO_NOT_EXIST_MESSAGE = "Entered avatarId do not exist. Entered avatarId: ";

    public IncorrectAvatarIdException(Integer avatarId) {
        super(
                avatarId == null
                        ? NO_AVATAR_ID_PROVIDED_MESSAGE
                        : AVATAR_ID_DO_NOT_EXIST_MESSAGE + avatarId,
                "INCORRECT_AVATAR_ID",
                HttpStatus.BAD_REQUEST
        );
    }
}
