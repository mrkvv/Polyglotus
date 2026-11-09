package polyglotus.training_service.service;

import org.springframework.stereotype.Service;
import polyglotus.training_service.dto.MatchTask;
import polyglotus.training_service.repository.DictionaryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MatchTaskService {
    private static final int PAIRS_PER_TASK = 5;

    private final DictionaryRepository dictionaryRepository;
    private final ValidationService validationService;

    public MatchTaskService(DictionaryRepository dictionaryRepository,
                            ValidationService validationService) {
        this.dictionaryRepository = dictionaryRepository;
        this.validationService = validationService;
    }

    public List<MatchTask> getMatchTasks(Integer userId, Integer amount) {
        validationService.validateAmount(amount);

        List<Map<String, Object>> rawUnlearnedWords =
                dictionaryRepository.getUnlearnedWordsByUserId(userId, amount * PAIRS_PER_TASK);

        List<MatchTask.Pair> allPairs = rawUnlearnedWords.stream()
                .map(MatchTask.Pair::fromMap)
                .toList();

        List<MatchTask> tasks = new ArrayList<>();
        for (int from = 0; from < allPairs.size(); from += PAIRS_PER_TASK) {
            int to = Math.min(from + PAIRS_PER_TASK, allPairs.size());
            tasks.add(new MatchTask(allPairs.subList(from, to)));
        }
        return tasks;
    }
}
