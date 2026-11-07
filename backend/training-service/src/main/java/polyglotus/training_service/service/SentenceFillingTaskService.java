package polyglotus.training_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import polyglotus.training_service.dto.aiservice.GetSentencesRequest;
import polyglotus.training_service.dto.FillingTasksResponse;
import polyglotus.training_service.dto.aiservice.GetSentencesResponse;
import polyglotus.training_service.exception.AiServiceUnavailableException;
import polyglotus.training_service.repository.DictionaryRepository;
import polyglotus.training_service.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Service
public class SentenceFillingTaskService {
    private static final Logger LOGGER = LoggerFactory.getLogger(SentenceFillingTaskService.class);

    private static final String GENERATE_SENTENCES_URL = "/ai/generate-sentences";

    private final RestClient restClient;
    private final DictionaryRepository dictionaryRepository;
    private final UserRepository userRepository;
    private final ValidationService validationService;

    public SentenceFillingTaskService(RestClient restClient,
                                      DictionaryRepository dictionaryRepository,
                                      UserRepository userRepository,
                                      ValidationService validationService) {
        this.restClient = restClient;
        this.dictionaryRepository = dictionaryRepository;
        this.userRepository = userRepository;
        this.validationService = validationService;
    }

    public FillingTasksResponse getFillingTasks(Integer userId, Integer amount) {
        validationService.validateAmount(amount);

        List<Map<String, Object>> rawUnlearnedWords =
                dictionaryRepository.getUnlearnedWordsByUserId(userId, amount);

        String userLevel = userRepository.getUserLevel(userId);

        try {
            GetSentencesRequest request = GetSentencesRequest.from(rawUnlearnedWords, userLevel);
            GetSentencesResponse response = restClient.post()
                    .uri(GENERATE_SENTENCES_URL)
                    .body(request)
                    .retrieve()
                    .body(GetSentencesResponse.class);

            if (response == null || response.sentences().isEmpty()) {
                throw new AiServiceUnavailableException();
            }
            return FillingTasksResponse.from(response);
        }
        catch (RestClientException e) {
            LOGGER.warn("AIService isn't responding.");
            throw new AiServiceUnavailableException(e);
        }

    }
}
