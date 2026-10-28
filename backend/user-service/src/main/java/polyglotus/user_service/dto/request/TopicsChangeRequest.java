package polyglotus.user_service.dto.request;

import java.util.List;

public record TopicsChangeRequest(List<Integer> newTopicIds) {}
