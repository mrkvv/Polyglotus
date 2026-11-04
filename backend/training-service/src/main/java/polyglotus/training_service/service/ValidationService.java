package polyglotus.training_service.service;

import org.springframework.stereotype.Service;
import polyglotus.training_service.exception.IncorrectTrainingsAmountException;

@Service
public class ValidationService {
    public void validateAmount(Integer amount) {
        if(amount < 1 || amount > 20) {
            throw new IncorrectTrainingsAmountException(amount);
        }
    }
}
