package polyglotus.training_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import polyglotus.training_service.repository.DictionaryRepository;
import polyglotus.training_service.repository.UserStreaksRepository;

import java.util.List;

@Service
public class WordProgressService {

    private final DictionaryRepository dictionaryRepository;
    private final UserStreaksRepository streaksRepository;

    public WordProgressService(DictionaryRepository dictionaryRepository,
                               UserStreaksRepository streaksRepository) {
        this.dictionaryRepository = dictionaryRepository;
        this.streaksRepository = streaksRepository;
    }

    @Transactional
    public void markCorrect(Integer userId, List<Integer> ids) {
        dictionaryRepository.markCorrect(userId, ids);
        streaksRepository.updateUserStreak(userId);
    }
}
