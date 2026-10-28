package polyglotus.user_service.dto.request;

import java.util.List;

public record OnboardingRequest (
        Integer levelId,
        Integer avatarId,
        List<Integer> themeIds
) {}
