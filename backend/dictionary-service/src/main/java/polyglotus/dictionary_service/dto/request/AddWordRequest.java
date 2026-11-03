package polyglotus.dictionary_service.dto.request;

public record AddWordRequest(
        String en,
        String ru,
        String partOfSpeech
) { }
