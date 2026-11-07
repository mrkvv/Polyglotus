package polyglotus.ai_service.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import polyglotus.ai_service.exception.ModelContextIsExhaustedException;
import polyglotus.ai_service.model.ChatMessage;
import polyglotus.ai_service.repository.ChatMessagesRepository;
import polyglotus.ai_service.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {
    private static final String USER_ROLE = "user";
    private static final String ASSISTANT_ROLE = "llm";

    private static final String TOP_K_WORDS_DELIMITER = ", ";

    private static final int CHARS_PER_TOKEN = 4;
    private static final int ADDITIONAL_TOKENS_PER_MESSAGE_WASTES = 4;
    private static final int TOKENS_LIMIT = 4096;

    private static final String SYSTEM_PROMPT = """
            You are an English teacher. You ONLY speak English.
            NEVER speak Russian. If the user writes in Russian, reply in English with a short reminder: "Please try in English."
            
            The user's English level is %s. Use vocabulary and grammar for that level.
            
            Try to use these words from the user's dictionary when appropriate: %s
            """;

    private final ChatClient client;
    private final ChatMessagesRepository chatMessagesRepository;
    private final UserRepository userRepository;
    private final EmbedderService embedderService;
    private final ValidationService validationService;

    public ChatService(@Qualifier("chatClient") ChatClient client,
                       ChatMessagesRepository chatMessagesRepository,
                       UserRepository userRepository,
                       EmbedderService embedderService,
                       ValidationService validationService) {
        this.client = client;
        this.chatMessagesRepository = chatMessagesRepository;
        this.userRepository = userRepository;
        this.embedderService = embedderService;
        this.validationService = validationService;
    }

    public String sendAndReceiveAnswer(Integer userId, String message) {
        validationService.validateMessage(message);

        List<ChatMessage> messageHistory = getUserHistory(userId);
        checkContextSize(messageHistory);

        List<String> topKDialogWords = embedderService.getTopKWords(userId, messageHistory, message);
        String topKDialogWordsString = String.join(TOP_K_WORDS_DELIMITER, topKDialogWords);

        List<Message> springMessages = formSpringMessages(
                userRepository.getUserLevel(userId),
                topKDialogWordsString,
                messageHistory,
                message
        );

        String answer = client.prompt()
                .messages(springMessages)
                .call()
                .content();

        chatMessagesRepository.insertMessages(
                userId,
                List.of(ChatMessage.user(userId, message), ChatMessage.assistant(userId, answer))
        );
        return answer;
    }

    public List<ChatMessage> getUserHistory(Integer userId) {
        return chatMessagesRepository.getUserChatHistory(userId)
                .stream()
                .map(ChatMessage::fromMap)
                .toList();
    }

    public void endDialog(Integer userId) {
        chatMessagesRepository.deleteDialog(userId);
    }


    private List<Message> formSpringMessages(
            String userLevel, String suggestedWords, List<ChatMessage> history, String currentMessage
    ) {
        List<Message> springMessages = new ArrayList<>();

        springMessages.add(
                new SystemMessage(String.format(SYSTEM_PROMPT, userLevel, suggestedWords))
        );

        for(ChatMessage msg : history) {
            if(msg.role().equalsIgnoreCase(USER_ROLE)) {
                springMessages.add(new UserMessage(msg.content()));
            }
            else if(msg.role().equalsIgnoreCase(ASSISTANT_ROLE)) {
                springMessages.add(new AssistantMessage(msg.content()));
            }
        }
        springMessages.add(new UserMessage(currentMessage));
        return springMessages;
    }

    private void checkContextSize(List<ChatMessage> history) {
        if(estimateHistoryTokens(history) > TOKENS_LIMIT) {
            throw new ModelContextIsExhaustedException();
        }
    }

    private int estimateTokens(String text) {
        if (text == null || text.isEmpty()) return 0;
        return (int) Math.ceil(text.length() / (double) CHARS_PER_TOKEN);
    }

    private int estimateHistoryTokens(List<ChatMessage> history) {
        int total = 0;
        for (ChatMessage msg : history) {
            total += estimateTokens(msg.content());
            total += ADDITIONAL_TOKENS_PER_MESSAGE_WASTES;
        }
        return total;
    }
}
