package polyglotus.dictionary_service.service;

import org.springframework.stereotype.Service;
import polyglotus.dictionary_service.dto.response.TranslationsResponse;
import polyglotus.dictionary_service.repository.DictionaryRepository;

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
        return TranslationsResponse.getBy(
                enWord,
                dictionaryRepository.getUserTranslations(userId, enWord),
                bloomHubService.getTranslations(enWord)
        );
    }
}
