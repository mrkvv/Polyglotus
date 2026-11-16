package polyglotus.dictionary_service.exception;

import org.springframework.http.HttpStatus;

public class UnsupportedSymbolException extends ApiException {
    public UnsupportedSymbolException(String word, char symbol) {
        super(
                "Word: '" + word + "' contains unsupported symbol: '" + symbol + "'.",
                "UNSUPPORTED_SYMBOL",
                HttpStatus.BAD_REQUEST
        );
    }
}
