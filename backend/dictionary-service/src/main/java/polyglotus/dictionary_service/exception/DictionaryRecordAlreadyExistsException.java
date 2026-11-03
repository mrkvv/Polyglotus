package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class DictionaryRecordAlreadyExistsException extends ApiException {
    public DictionaryRecordAlreadyExistsException() {
        super(
                "User dictionary already contains a record with the same word, translation, and part of speech.",
                "RECORD_ALREADY_EXISTS",
                HttpStatus.CONFLICT
        );
    }
}
