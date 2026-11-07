package polyglotus.ai_service.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiClientConfig {

    private static final double CHAT_TEMPERATURE = 0.3;
    private static final double EXERCISE_TEMPERATURE = 0.2;

    private static final String EXERCISE_SYSTEM_PROMPT = """
            You create English fill-in-the-blank exercises for language learners.
            TASK: Given ONE target word and a CEFR level, write exactly ONE sentence.
            
            RULES:
            - Replace the target word with ______ (six underscores) in the sentence.
            - The target word MUST NOT appear anywhere in the sentence. Only ______ represents it.
            - The sentence must be grammatically correct and appropriate for the given CEFR level.
            - Return ONLY the sentence. No numbering, no quotes, no explanations.
            
            EXAMPLES:
            Target word: apple | Level: B1
            I ate a juicy ______ for breakfast.
            
            Target word: running | Level: A2
            She goes ______ every morning before work.
            
            Target word: beautiful | Level: B2
            The sunset was so ______ that we stopped to take photos.
            """;

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultOptions(
                        OllamaChatOptions.builder()
                                .temperature(CHAT_TEMPERATURE)
                )
                .build();
    }

    @Bean
    public ChatClient exerciseClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(EXERCISE_SYSTEM_PROMPT)
                .defaultOptions(
                        OllamaChatOptions.builder()
                                .temperature(EXERCISE_TEMPERATURE)
                )
                .build();
    }
}
