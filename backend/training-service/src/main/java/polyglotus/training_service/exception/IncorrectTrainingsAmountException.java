package polyglotus.training_service.exception;

import org.springframework.http.HttpStatus;

public class IncorrectTrainingsAmountException extends ApiException {
    public IncorrectTrainingsAmountException(Integer amount) {
        super(
                "Query param 'amount' must be positive and less or equal than 20. Entered value: " + amount,
                "INCORRECT_TRAININGS_AMOUNT",
                HttpStatus.BAD_REQUEST
        );
    }
}
