package polyglotus.ai_service.dto;

import polyglotus.ai_service.exception.SentencesGeneratingException;
import polyglotus.ai_service.model.Word;

import java.util.ArrayList;
import java.util.List;

public record GenerateSentencesResponse (
        List<Task> sentences
) {
    private record Task(
            Integer id,
            String sentence,
            String answer
    ) {}

    public static GenerateSentencesResponse from(List<Word> words, List<String> sentences) {
        if(words.size() != sentences.size()){
            throw new SentencesGeneratingException();
        }

        List<Task> tasks = new ArrayList<>();
        for(int i = 0; i < words.size(); i++) {
            Word word = words.get(i);

            Integer id = word.id();
            String sentence = sentences.get(i);
            String answer = word.word();
            tasks.add(new Task(id, sentence, answer));
        }
        return new GenerateSentencesResponse(tasks);
    }
}
