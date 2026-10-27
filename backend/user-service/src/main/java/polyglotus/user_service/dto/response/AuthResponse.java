package polyglotus.user_service.dto.response;

public record AuthResponse (
        String token,
        String firstName,
        String lastName,
        int id
) {}
