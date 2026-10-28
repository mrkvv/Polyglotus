package polyglotus.user_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import polyglotus.user_service.dto.response.ReferencesResponse;
import polyglotus.user_service.repository.AvatarsRepository;
import polyglotus.user_service.repository.LevelsRepository;
import polyglotus.user_service.repository.TopicsRepository;

import java.util.List;

@Service
public class ReferenceService {
    private final AvatarsRepository avatarsRepository;
    private final LevelsRepository levelsRepository;
    private final TopicsRepository topicsRepository;

    public ReferenceService(AvatarsRepository avatarsRepository,
                            LevelsRepository levelsRepository,
                            TopicsRepository topicsRepository) {
        this.avatarsRepository = avatarsRepository;
        this.levelsRepository = levelsRepository;
        this.topicsRepository = topicsRepository;
    }

    public ReferencesResponse getReferences() {
        List<ReferencesResponse.Avatar> avatars =
                avatarsRepository.getAllAvatars()
                        .stream()
                        .map(ReferencesResponse.Avatar::fromMap)
                        .toList();

        List<ReferencesResponse.Level> levels =
                levelsRepository.getAllLevels()
                        .stream()
                        .map(ReferencesResponse.Level::fromMap)
                        .toList();


        List<ReferencesResponse.Topic> topics =
                topicsRepository.getAllTopics()
                        .stream()
                        .map(ReferencesResponse.Topic::fromMap)
                        .toList();

        return new ReferencesResponse(levels, topics, avatars);
    }
}
