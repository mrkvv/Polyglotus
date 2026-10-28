package polyglotus.user_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import polyglotus.user_service.dto.response.AuthResponse;
import polyglotus.user_service.dto.request.OnboardingRequest;
import polyglotus.user_service.dto.User;
import polyglotus.user_service.dto.response.YandexInfoResponse;
import polyglotus.user_service.exception.IncorrectAvatarIdException;
import polyglotus.user_service.exception.IncorrectLevelIdException;
import polyglotus.user_service.exception.IncorrectTopicIdException;
import polyglotus.user_service.repository.*;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserTopicsRepository userTopicsRepository;
    private final LevelsRepository levelsRepository;
    private final UserStreaksRepository userStreaksRepository;
    private final AvatarsRepository avatarsRepository;
    private final TopicsRepository topicsRepository;

    private final RedisRepository redisRepository;

    public UserService(UserRepository userRepository,
                       UserTopicsRepository userTopicsRepository,
                       LevelsRepository levelsRepository,
                       UserStreaksRepository userStreaksRepository,
                       AvatarsRepository avatarsRepository,
                       TopicsRepository topicsRepository,
                       RedisRepository redisRepository) {
        this.userRepository = userRepository;
        this.userTopicsRepository = userTopicsRepository;
        this.levelsRepository = levelsRepository;
        this.userStreaksRepository = userStreaksRepository;
        this.avatarsRepository = avatarsRepository;
        this.topicsRepository = topicsRepository;
        this.redisRepository = redisRepository;
    }

    public AuthResponse login(YandexInfoResponse info) {
        String firstName = info.firstName();
        String lastName = info.lastName();

        Integer id = userRepository.insertUserAndGetId(info.yandexId(),firstName, lastName);
        String token = redisRepository.createSession(id);

        return new AuthResponse(token, firstName, lastName, id);
    }

    public void logout(String token) {
        redisRepository.deleteSession(token);
    }

    @Transactional
    public void onboardUser(Integer userId, OnboardingRequest info) {
        ensureLevelExists(info.levelId());
        ensureAvatarExists(info.avatarId());

        if(info.themeIds() == null) throw new IncorrectTopicIdException(null);
        List<Integer> distinctTopicIds = info.themeIds().stream()
                .distinct()
                .toList();
        ensureTopicsExists(distinctTopicIds);

        userRepository.updateUser(userId, info.levelId(), info.avatarId());
        userTopicsRepository.insertTopics(userId, distinctTopicIds);
        userStreaksRepository.insertUser(userId);
    }

    @Transactional
    public User getUserInfo(Integer userId) {
        List<Integer> userTopics = userTopicsRepository.getUserTopics(userId);
        return User.fromMap(userRepository.getUserInfo(userId), userTopics);
    }

    public void setUserLevel(Integer userId, Integer newLevelId) {
        ensureLevelExists(newLevelId);
        userRepository.setUserLevel(userId, newLevelId);
    }

    public void setUserAvatar(Integer userId, Integer avatarId) {
        ensureAvatarExists(avatarId);
        userRepository.setUserAvatar(userId, avatarId);
    }

    @Transactional
    public List<Integer> setUserTopics(Integer userId, List<Integer> topicIds) {
        if(topicIds == null) throw new IncorrectTopicIdException(topicIds);

        List<Integer> distinctTopicIds = topicIds.stream().distinct().toList();
        ensureTopicsExists(distinctTopicIds);

        userTopicsRepository.deleteUserTopics(userId);
        userTopicsRepository.insertTopics(userId, distinctTopicIds);
        return distinctTopicIds;
    }


    private void ensureLevelExists(Integer levelId) {
        if(levelId == null || !levelsRepository.levelExists(levelId)) {
            throw new IncorrectLevelIdException(levelId);
        }
    }

    private void ensureAvatarExists(Integer avatarId) {
        if(avatarId == null || !avatarsRepository.avatarExists(avatarId)) {
            throw new IncorrectAvatarIdException(avatarId);
        }
    }

    private void ensureTopicsExists(List<Integer> topicIds) {
        if(topicIds.isEmpty() || !topicsRepository.topicsExist(topicIds)) {
            throw new IncorrectTopicIdException(topicIds);
        }
    }
}
