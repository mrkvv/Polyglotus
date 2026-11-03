package polyglotus.dictionary_service.dto;

import java.util.List;

public record DictionaryPage(
        List<Word> words,
        Integer page,
        Integer size,
        Integer totalElements,
        Integer totalPages,
        Boolean hasNext,
        Boolean hasPrevious
) {}
