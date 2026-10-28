package polyglotus.user_service.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class IncorrectTopicIdException extends ApiException {

    private static final String NO_TOPICS_PROVIDED_MESSAGE = "No topicIds provided";
    private static final String TOPIC_DO_NOT_EXIST_MESSAGE = "At least one topicId didn't exist. Entered topicIds: ";

    public IncorrectTopicIdException(List<Integer> topicIds) {
        super(
                topicIds == null || topicIds.isEmpty()
                        ? NO_TOPICS_PROVIDED_MESSAGE
                        : TOPIC_DO_NOT_EXIST_MESSAGE + topicIds,
                "INCORRECT_TOPIC_ID",
                HttpStatus.BAD_REQUEST
        );
    }
}
