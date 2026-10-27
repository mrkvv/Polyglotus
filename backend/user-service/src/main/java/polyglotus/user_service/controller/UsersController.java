package polyglotus.user_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import polyglotus.user_service.dto.request.AvatarChangeRequest;
import polyglotus.user_service.dto.request.LevelChangeRequest;
import polyglotus.user_service.dto.request.OnboardingRequest;
import polyglotus.user_service.dto.User;
import polyglotus.user_service.dto.request.TopicsChangeRequest;
import polyglotus.user_service.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UsersController {

    private static final String USER_ID_HEADER = "X-User-Id";

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/me/onboarding")
    public ResponseEntity<Void> onboard(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestBody OnboardingRequest request
    ) {
        userService.onboardUser(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getUserInfo(
            @RequestHeader(value = USER_ID_HEADER) Integer id
    ) {
        return ResponseEntity.ok(userService.getUserInfo(id));
    }

    @PutMapping("/me/level")
    public ResponseEntity<Map<String, Integer>> setUserLevel(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestBody LevelChangeRequest request
    ) {
        userService.setUserLevel(id, request.newLevelId());
        Map<String, Integer> response = Map.of("levelId", request.newLevelId());
        return ResponseEntity.ok(response);
    }


    @PutMapping("/me/avatar")
    public ResponseEntity<Map<String, Integer>> setUserAvatar(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestBody AvatarChangeRequest request
    ) {
        userService.setUserAvatar(id, request.newAvatarId());
        Map<String, Integer> response = Map.of("avatarId", request.newAvatarId());
        return ResponseEntity.ok(response);
    }


    @PutMapping("/me/topics")
    public ResponseEntity<Map<String, List<Integer>>> setUserTopics(
            @RequestHeader(value = USER_ID_HEADER) Integer id,
            @RequestBody TopicsChangeRequest request
    ) {
        List<Integer> insertedTopics = userService.setUserTopics(id, request.newTopicIds());
        Map<String, List<Integer>> response = Map.of("topicIds", insertedTopics);
        return ResponseEntity.ok(response);
    }
}
