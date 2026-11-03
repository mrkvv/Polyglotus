package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class DictionaryRecordNotFoundException extends ApiException {
    public DictionaryRecordNotFoundException(Integer wordId) {
        super(
                "Dictionary record with id '" + wordId + "' not found or does not belong to the current user.",
                "RECORD_NOT_FOUND",
                HttpStatus.NOT_FOUND
        );
    }
}
