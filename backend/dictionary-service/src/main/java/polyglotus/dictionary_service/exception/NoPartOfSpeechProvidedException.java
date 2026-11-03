package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class NoPartOfSpeechProvidedException extends ApiException {
    public NoPartOfSpeechProvidedException() {
        super(
                "Part of speech must be provided and not be blank",
                "NO_PART_OF_SPEECH_PROVIDED",
                HttpStatus.BAD_REQUEST
        );
    }
}
