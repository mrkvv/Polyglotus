package polyglotus.ai_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import polyglotus.ai_service.dto.GenerateSentencesResponse;
import polyglotus.ai_service.exception.TooManyWordsException;
import polyglotus.ai_service.model.Word;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExerciseService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExerciseService.class);

    private static final int MAX_WORDS_PER_REQUEST_ALLOWED = 10;
    private static final int MAX_GENERATING_ATTEMPTS = 3;

    private final ChatClient client;
    private final ValidationService validationService;

    public ExerciseService(
            @Qualifier("exerciseClient") ChatClient client,
            ValidationService validationService) {
        this.client = client;
        this.validationService = validationService;
    }

    public GenerateSentencesResponse generateSentences(List<Word> words, String level) {
        if(words.size() > MAX_WORDS_PER_REQUEST_ALLOWED) {
            throw new TooManyWordsException(MAX_WORDS_PER_REQUEST_ALLOWED, words.size());
        }

        List<String> generatedSentences = new ArrayList<>();
        List<String> stringWords = words.stream()
                .map(Word::word)
                .toList();

        for(String word : stringWords) {
            generatedSentences.add(generateSentenceForWord(word, level));
        }

        return GenerateSentencesResponse.from(words, generatedSentences);
    }

    private String generateSentenceForWord(String word, String level) {
        for(int attempt = 0; attempt < MAX_GENERATING_ATTEMPTS; attempt++) {
            String sentence = client.prompt()
                    .user("Word: " + word + ". Level: " + level)
                    .call()
                    .content();

            if(validationService.isGeneratedSentenceCorrect(sentence, word)) {
                return sentence;
            }
            LOGGER.warn("Failed to generate sentence for word '{}'. Generated sentence: {}", word, sentence);
        }
        return null;
    }
}
