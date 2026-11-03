package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

import java.util.Set;
import java.util.stream.Collectors;

public class IncorrectPartOfSpeechException extends ApiException {
    public IncorrectPartOfSpeechException(Set<String> allowedPartsOfSpeech, String entered) {
        super(
                "Incorrect part of speech: '" + entered + "'. Allowed values: " + allowedValues(allowedPartsOfSpeech),
                "INCORRECT_PART_OF_SPEECH",
                HttpStatus.BAD_REQUEST
        );
    }

    private static String allowedValues(Set<String> allowedPartsOfSpeech) {
        return allowedPartsOfSpeech.stream()
                .sorted()
                .collect(Collectors.joining(", "));
    }
}
