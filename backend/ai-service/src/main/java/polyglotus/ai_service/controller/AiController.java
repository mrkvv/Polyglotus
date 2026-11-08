package polyglotus.ai_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import polyglotus.ai_service.dto.ChatRequest;
import polyglotus.ai_service.dto.GenerateSentencesRequest;
import polyglotus.ai_service.dto.GenerateSentencesResponse;
import polyglotus.ai_service.model.ChatMessage;
import polyglotus.ai_service.service.ChatService;
import polyglotus.ai_service.service.ExerciseService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiController {

    private static final String X_USER_ID_HEADER = "X-User-Id";

    private final ChatService chatService;
    private final ExerciseService exerciseService;

    public AiController(ChatService chatService,
                        ExerciseService exerciseService) {
        this.chatService = chatService;
        this.exerciseService = exerciseService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId,
            @RequestBody ChatRequest request
    ) {
        Map<String, String> response = Map.of(
                "userMessage", request.content(),
                "aiMessage", chatService.sendAndReceiveAnswer(userId, request.content())
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/chat")
    public ResponseEntity<Map<String, List<ChatMessage>>> getUserHistory(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId
    ){
        return ResponseEntity.ok(
                Map.of("messages", chatService.getUserHistory(userId))
        );
    }

    @DeleteMapping("/chat")
    public ResponseEntity<Void> endDialog(
            @RequestHeader(name = X_USER_ID_HEADER) Integer userId
    ) {
        chatService.endDialog(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .build();
    }

    @PostMapping("/generate-sentences")
    public ResponseEntity<GenerateSentencesResponse> generateSentences(
            @RequestBody GenerateSentencesRequest request
    ) {
        return ResponseEntity.ok(
                exerciseService.generateSentences(request.words(), request.level())
        );
    }
}
