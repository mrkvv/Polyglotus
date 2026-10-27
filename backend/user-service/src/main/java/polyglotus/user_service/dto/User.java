package polyglotus.user_service.dto;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public record User (
        Integer id,
        String yandexId,
        String firstName,
        String lastName,
        Integer levelId,
        Integer avatarId,
        List<Integer> topicIds,
        Streak streak,
        String createdAt
) {

    private record Streak (
            Integer current,
            Integer longest,
            String lastTrainingDate
    ) {}

    public static User fromMap(Map<String, Object> map, List<Integer> topicIds) {
        Integer id = (Integer) map.get("id");
        String yandexId = (String) map.get("yandex_id");
        String firstName = (String) map.get("first_name");
        String lastName = (String) map.get("last_name");
        Integer levelId = (Integer) map.get("level_id");
        Integer avatarId = (Integer) map.get("avatar_id");
        String createdAt = Objects.toString(map.get("created_at"), null);

        Integer currentStreak = (Integer) map.get("current_streak");
        Integer longestStreak = (Integer) map.get("longest_streak");
        String lastTrainingDate = Objects.toString(map.get("last_training_date"), null);
        Streak streak = new Streak(currentStreak, longestStreak, lastTrainingDate);

        return new User(id, yandexId, firstName, lastName,
                levelId, avatarId, topicIds, streak, createdAt);
    }
}
