package polyglotus.dictionary_service.service;

import org.springframework.stereotype.Service;
import polyglotus.dictionary_service.dto.BloomHubTranslationGroup;
import polyglotus.dictionary_service.dto.response.TranslationsResponse;
import polyglotus.dictionary_service.repository.DictionaryRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TranslationService {

    private final BloomHubService bloomHubService;
    private final DictionaryRepository dictionaryRepository;

    public TranslationService(BloomHubService bloomHubService,
                              DictionaryRepository dictionaryRepository) {
        this.bloomHubService = bloomHubService;
        this.dictionaryRepository = dictionaryRepository;
    }

    public TranslationsResponse getTranslations(Integer userId, String enWord) {

        List<TranslationsResponse.Translation> addedToDictionary =
                dictionaryRepository.getUserTranslations(userId, enWord)
                        .stream()
                        .map(TranslationsResponse.Translation::fromMap)
                        .toList();

        Set<String> added = addedToDictionary.stream()
                .map(TranslationsResponse.Translation::ru)
                .collect(Collectors.toSet());

        List<BloomHubTranslationGroup> couldBeAdded = bloomHubService.getTranslations(enWord)
                .stream()
                .map(e -> e.without(added))
                .filter(e -> !e.translations().isEmpty())
                .toList();

        return new TranslationsResponse(enWord, addedToDictionary, couldBeAdded);
    }
}
