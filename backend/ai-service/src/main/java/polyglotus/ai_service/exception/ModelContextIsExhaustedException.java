package polyglotus.ai_service.exception;

import org.springframework.http.HttpStatus;

public class ModelContextIsExhaustedException extends ApiException {
    public ModelContextIsExhaustedException() {
        super(
                "Model's context is exhausted. Start new dialog.",
                "MODEL_CONTEXT_EXHAUSTED",
                HttpStatus.UNPROCESSABLE_CONTENT
        );
    }
}
