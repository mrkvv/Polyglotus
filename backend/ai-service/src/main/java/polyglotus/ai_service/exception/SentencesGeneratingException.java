package polyglotus.ai_service.exception;

import org.springframework.http.HttpStatus;

public class SentencesGeneratingException extends ApiException {
    public SentencesGeneratingException() {
        super(
                "Something went wrong while generating sentences. Please, try again.",
                "SENTENCES_GENERATING_ERROR",
                HttpStatus.BAD_GATEWAY
        );
    }
}
