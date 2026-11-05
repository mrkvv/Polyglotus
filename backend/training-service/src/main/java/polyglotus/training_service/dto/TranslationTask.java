package polyglotus.training_service.dto;

import polyglotus.training_service.model.TranslationDirection;
import polyglotus.training_service.model.Word;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public record TranslationTask(
        Integer id,
        String word,
        List<String> options,
        String answer
) {
    public static TranslationTask toTask(
            Word word, List<String> distractors,
            TranslationDirection translationDirection
    ) {
        boolean isEn = translationDirection == TranslationDirection.EN;
        String questionWord = isEn ? word.ruWord() : word.enWord();
        String answer = isEn ? word.enWord() : word.ruWord();

        List<String> options = new ArrayList<>(distractors);
        options.add(getRandomIndexLessThen(options.size() + 1), answer);

        return new TranslationTask(
                word.id(),
                questionWord,
                options,
                answer
        );
    }

    private static int getRandomIndexLessThen(int val) {
        return ThreadLocalRandom.current().nextInt(val);
    }
}
