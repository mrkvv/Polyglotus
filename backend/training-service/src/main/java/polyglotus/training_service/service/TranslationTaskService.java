package polyglotus.training_service.service;

import org.springframework.stereotype.Service;
import polyglotus.training_service.dto.TranslationTask;
import polyglotus.training_service.model.TranslationDirection;
import polyglotus.training_service.model.Word;
import polyglotus.training_service.repository.DictionaryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TranslationTaskService {
    private static final int DISTRACTORS_AMOUNT = 3;

    private final DictionaryRepository dictionaryRepository;
    private final ValidationService validationService;

    public TranslationTaskService(DictionaryRepository dictionaryRepository,
                                  ValidationService validationService) {
        this.dictionaryRepository = dictionaryRepository;
        this.validationService = validationService;
    }

    public List<TranslationTask> buildTasks(
            Integer userId, Integer amount, String language
    ) {
        TranslationDirection translationDirection = TranslationDirection.fromString(language);
        validationService.validateAmount(amount);

        List<Word> unlearnedWords = getUnlearnedWords(userId, amount);
        if(unlearnedWords.isEmpty()) return List.of();

        Map<String, List<Word>> wordsByPartOfSpeech = unlearnedWords.stream()
                .collect(Collectors.groupingBy(Word::partOfSpeech));

        List<TranslationTask> result = new ArrayList<>();
        for(Map.Entry<String, List<Word>> entry : wordsByPartOfSpeech.entrySet()) {
            String partOfSpeech = entry.getKey();
            List<Word> words = entry.getValue();

            List<String> distractors = formDistractors(userId, partOfSpeech, words, translationDirection);
            List<TranslationTask> tasks = toTranslationTasks(words, distractors, translationDirection);
            result.addAll(tasks);
        }
        return result;
    }

    private List<Word> getUnlearnedWords(Integer userId, Integer amount) {
        return dictionaryRepository.getUnlearnedWordsByUserId(userId, amount)
                .stream()
                .map(Word::fromMap)
                .toList();
    }

    private List<String> formDistractors(
            Integer userId, String partOfSpeech, List<Word> words,
            TranslationDirection translationDirection
    ) {
        List<String> collected = new ArrayList<>();
        int distractorsNeeded = DISTRACTORS_AMOUNT * words.size();

        List<String> wordsToAvoid = words.stream()
                .map(word -> translate(word, translationDirection))
                .collect(Collectors.toCollection(ArrayList::new));

        List<String> level1 = fetchDistractorsByUserAndPartOfSpeech(
                userId, partOfSpeech, wordsToAvoid, distractorsNeeded, translationDirection);
        distractorsNeeded -= level1.size();
        collected.addAll(level1);
        if(distractorsNeeded <= 0) return collected;
        wordsToAvoid.addAll(level1);

        List<String> level2 = fetchDistractorsByPartOfSpeech(
                partOfSpeech, wordsToAvoid, distractorsNeeded, translationDirection);
        distractorsNeeded -= level2.size();
        collected.addAll(level2);
        if(distractorsNeeded <= 0) return collected;
        wordsToAvoid.addAll(level2);

        List<String> level3 = fetchAnyDistractors(
                wordsToAvoid, distractorsNeeded, translationDirection);
        collected.addAll(level3);
        return collected;
    }

    private static String translate(Word word, TranslationDirection direction) {
        return switch (direction) {
            case EN -> word.enWord();
            case RU -> word.ruWord();
        };
    }

    private List<String> fetchDistractorsByUserAndPartOfSpeech(
            Integer userId, String partOfSpeech, List<String> wordsToAvoid,
            int amount, TranslationDirection direction
    ) {
        return direction == TranslationDirection.EN
                ? dictionaryRepository.getEnDistractorsByUserAndPartOfSpeech(
                        userId, partOfSpeech, wordsToAvoid, amount)
                : dictionaryRepository.getRuDistractorsByUserAndPartOfSpeech(
                        userId, partOfSpeech, wordsToAvoid, amount);
    }

    private List<String> fetchDistractorsByPartOfSpeech(
            String partOfSpeech, List<String> wordsToAvoid,
            int amount, TranslationDirection direction
    ) {
        return direction == TranslationDirection.EN
                ? dictionaryRepository.getEnDistractorsByPartOfSpeech(
                        partOfSpeech, wordsToAvoid, amount)
                : dictionaryRepository.getRuDistractorsByPartOfSpeech(
                        partOfSpeech, wordsToAvoid, amount);
    }

    private List<String> fetchAnyDistractors(
            List<String> wordsToAvoid, int amount, TranslationDirection direction
    ) {
        return direction == TranslationDirection.EN
                ? dictionaryRepository.getAnyEnDistractors(wordsToAvoid, amount)
                : dictionaryRepository.getAnyRuDistractors(wordsToAvoid, amount);
    }

    private List<TranslationTask> toTranslationTasks(
            List<Word> words, List<String> allDistractors,
            TranslationDirection translationDirection
    ) {
        List<TranslationTask> result = new ArrayList<>();

        for(int i = 0; i < words.size(); i++) {
            int from = i * DISTRACTORS_AMOUNT;
            int to = Math.min(from + DISTRACTORS_AMOUNT, allDistractors.size());

            List<String> distractors = from < allDistractors.size()
                    ? allDistractors.subList(from, to)
                    : List.of();
            result.add(TranslationTask.toTask(words.get(i), distractors, translationDirection));
        }
        return result;
    }
}
