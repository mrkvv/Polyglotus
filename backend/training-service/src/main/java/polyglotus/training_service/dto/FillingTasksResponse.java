package polyglotus.training_service.dto;

import polyglotus.training_service.dto.aiservice.GetSentencesResponse;

import java.util.ArrayList;
import java.util.List;

public record FillingTasksResponse(
        List<FillingTask> tasks,
        Integer amount
) {
    private record FillingTask(
            Integer id,
            String sentence,
            String answer
    ) {}

    public static FillingTasksResponse from(GetSentencesResponse response) {
        List<GetSentencesResponse.Sentence> sentences = response.sentences();

        List<FillingTask> tasks = new ArrayList<>();
        for(GetSentencesResponse.Sentence sentence : sentences) {
            if(sentence.sentence() != null) {
                tasks.add(
                        new FillingTask(sentence.id(), sentence.sentence(), sentence.answer())
                );
            }
        }
        Integer amount = tasks.size();
        return new FillingTasksResponse(tasks, amount);
    }
}
