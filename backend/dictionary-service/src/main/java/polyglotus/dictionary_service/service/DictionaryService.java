package polyglotus.dictionary_service.service;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import polyglotus.dictionary_service.dto.DictionaryPage;
import polyglotus.dictionary_service.dto.Word;
import polyglotus.dictionary_service.exception.*;
import polyglotus.dictionary_service.repository.DictionaryRepository;
import polyglotus.dictionary_service.repository.WordRepository;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class DictionaryService {

    private final WordRepository wordRepository;
    private final DictionaryRepository dictionaryRepository;
    private final ValidationService validationService;

    public DictionaryService(WordRepository wordRepository,
                             DictionaryRepository dictionaryRepository,
                             ValidationService validationService) {
        this.wordRepository = wordRepository;
        this.dictionaryRepository = dictionaryRepository;
        this.validationService = validationService;
    }

    @Transactional
    public Word addWord(Integer userId, String en, String ru, String partOfSpeech) {
        validationService.validateWords(en, ru);
        validationService.validatePartOfSpeech(partOfSpeech);

        Integer enWordId = wordRepository.findOrCreateEnWord(en);
        Integer ruWordId = wordRepository.findOrCreateRuWord(ru);

        Integer recordId = dictionaryRepository
                .insertAndGetRecordId(userId, enWordId, ruWordId, partOfSpeech);
        return Word.fromMap(dictionaryRepository.getRecordById(recordId));
    }

    @Transactional
    public DictionaryPage getPage(Integer userId, Integer page, Integer size, String status) {
        validationService.validateSize(size);

        if(status != null) {
            status = status.toUpperCase(Locale.ROOT);
        }
        validationService.validateWordStatus(status);

        Integer totalElements = dictionaryRepository.recordsCount(userId, status);
        Integer totalPages = (int) Math.ceil((double) totalElements / size);
        validationService.validatePage(page, totalPages);

        Boolean hasNext = page < (totalPages - 1);
        Boolean hasPrevious = page > 0;

        List<Map<String, Object>> rawWordsList =
                dictionaryRepository.getPage(userId, page, size, status);

        List<Word> words = rawWordsList.stream()
                .map(Word::fromMap)
                .toList();

        return new DictionaryPage(words, page, size, totalElements, totalPages, hasNext, hasPrevious);
    }

    public void deleteWord(Integer userId, Integer wordId) {
        dictionaryRepository.deleteWord(userId, wordId);
    }

    public void deleteWordsBatch(Integer userId, List<Integer> wordIds) {
        dictionaryRepository.deleteWordsBatch(userId, wordIds);
    }

    @Transactional
    public Word setWordStatus(Integer userId, Integer wordId, String status) {
        if(status == null) throw new NoStatusProvidedException();
        status = status.toUpperCase(Locale.ROOT);
        validationService.validateWordStatus(status);

        boolean isStatusSet = dictionaryRepository.setWordStatus(userId, wordId, status);
        if(!isStatusSet) {
            throw new WordNotFoundException(userId);
        }

        Map<String, Object> changedRecordMap = dictionaryRepository.getRecordById(wordId);
        return Word.fromMap(changedRecordMap);
    }

    @Transactional
    public void setWordsStatusBatch(Integer userId, List<Integer> wordIds, String status) {
        if(status == null) throw new NoStatusProvidedException();
        status = status.toUpperCase(Locale.ROOT);
        validationService.validateWordStatus(status);

        dictionaryRepository.setWordsStatusBatch(userId, wordIds, status);
    }

    @Transactional
    public Word editWord(Integer userId, Integer wordId, String ru, String en, String partOfSpeech) {
        validationService.validateWords(ru, en);
        validationService.validatePartOfSpeech(partOfSpeech);

        Integer enWordId = wordRepository.findOrCreateEnWord(en);
        Integer ruWordId = wordRepository.findOrCreateRuWord(ru);

        List<Integer> edited;
        try {
            edited = dictionaryRepository.editWord(wordId, userId, enWordId, ruWordId, partOfSpeech);
        }
        catch (DuplicateKeyException e) {
            throw new DictionaryRecordAlreadyExistsException();
        }

        if(edited.isEmpty()) {
            throw new DictionaryRecordNotFoundException(wordId);
        }

        return Word.fromMap(dictionaryRepository.getRecordById(edited.getFirst()));
    }
}
