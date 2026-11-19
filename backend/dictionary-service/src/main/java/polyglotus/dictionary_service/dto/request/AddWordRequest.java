package polyglotus.dictionary_service.dto.request;

public record AddWordRequest(
        String en,
        String ru,
        String partOfSpeech
) {
    public AddWordRequest {
        en = normalize(en);
        ru = normalize(ru);
    }

    private static String normalize(String value) {
        return value == null ? null : value.strip();
    }
}
