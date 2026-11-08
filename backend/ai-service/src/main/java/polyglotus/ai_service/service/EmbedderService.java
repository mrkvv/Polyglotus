package polyglotus.ai_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import polyglotus.ai_service.dto.TopKRequest;
import polyglotus.ai_service.dto.TopKResponse;
import polyglotus.ai_service.model.ChatMessage;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmbedderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EmbedderService.class);

    private static final int TOP_K = 10;
    private static final String TOP_K_URI = "/embedder/topk";

    private final RestClient client;

    public EmbedderService(RestClient client) {
        this.client = client;
    }

    public List<String> getTopKWords(Integer userId, List<ChatMessage> chatMessages, String currentMessage) {
        List<String> messages = formMessagesList(chatMessages, currentMessage);
        TopKRequest request = new TopKRequest(userId, messages, TOP_K);

        try {
            TopKResponse response = client.post()
                    .uri(TOP_K_URI)
                    .body(request)
                    .retrieve()
                    .body(TopKResponse.class);

            return (response == null || response.words() == null)
                    ? List.of()
                    : response.getStringWords();
        }
        catch (RestClientException e) {
            LOGGER.warn(
                    "EmbedderService is unavailable, continuing without words suggestions. Error: {}",
                    e.getMessage()
            );
            return List.of();
        }
    }

    private List<String> formMessagesList(List<ChatMessage> chatMessages, String currentMessage) {
        List<String> messagesHistory = chatMessages.stream()
                .map(ChatMessage::content)
                .toList();

        List<String> allMessages = new ArrayList<>(messagesHistory);
        allMessages.add(currentMessage);

        return allMessages;
    }
}
