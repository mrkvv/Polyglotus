package polyglotus.ai_service.dto;

import java.util.List;

public record TopKRequest(
        Integer userId,
        List<String> messages,
        Integer topK
) {}
