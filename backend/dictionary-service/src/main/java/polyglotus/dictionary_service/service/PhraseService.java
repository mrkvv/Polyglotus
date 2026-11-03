package polyglotus.dictionary_service.service;

import org.springframework.stereotype.Service;
import polyglotus.dictionary_service.repository.MotivationalPhraseRepository;

@Service
public class PhraseService {

    private final MotivationalPhraseRepository phraseRepository;

    public PhraseService(MotivationalPhraseRepository phraseRepository) {
        this.phraseRepository = phraseRepository;
    }

    public String getPhrase() {
        return phraseRepository.getPhrase();
    }
}
