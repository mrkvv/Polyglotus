package polyglotus.dictionary_service.service;

import org.springframework.stereotype.Service;
import polyglotus.dictionary_service.exception.*;

import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ValidationService {

    private static final Set<String> ALLOWED_PARTS_OF_SPEECH = Set.of(
            "noun", "verb", "modal_verb", "adjective", "adverb", "pronoun",
            "numeral", "numeral_fractional", "determiner", "interjection",
            "article", "preposition", "conjunction", "letter", "phrase",
            "grammar_pattern"
    );

    private static final Pattern BLACK_LIST = Pattern.compile("[\\d`\"[^\\p{L}\\s()'-]]");

    private static final Pattern RU_ALLOWED = Pattern.compile("^[а-яёА-ЯЁ\\s()'-]+$");
    private static final Pattern EN_ALLOWED = Pattern.compile("^[a-zA-Z\\s()'-]+$");

    private static final int MAX_WORD_LENGTH = 30;

    public void validateWords(String ruWord, String enWord) {
        if(ruWord == null || enWord == null || ruWord.isBlank() || enWord.isBlank()) {
            throw new NoWordsProvidedException();
        }
    }

    public void validateWordsLanguage(String ruWord, String enWord) {
        checkBlackList(ruWord);
        checkBlackList(enWord);

        if(!RU_ALLOWED.matcher(ruWord).matches()) {
            throw new InvalidAlphabetException(ruWord);
        }
        if(!EN_ALLOWED.matcher(enWord).matches()) {
            throw new InvalidAlphabetException(enWord);
        }
    }

    private void checkBlackList(String word) {
        Matcher m = BLACK_LIST.matcher(word);
        if (m.find()) {
            char badSymbol = word.charAt(m.start());
            throw new UnsupportedSymbolException(word, badSymbol);
        }
    }

    public void validateWordsLength(String ruWord, String enWord) {
        if(ruWord.length() > MAX_WORD_LENGTH || enWord.length() > MAX_WORD_LENGTH) {
            throw new WordsSizeLimitExceededException(ruWord, enWord, MAX_WORD_LENGTH);
        }
    }

    public void validatePartOfSpeech(String partOfSpeech) {
        if(partOfSpeech == null || partOfSpeech.isBlank()) {
            throw new NoPartOfSpeechProvidedException();
        }

        if(!ALLOWED_PARTS_OF_SPEECH.contains(partOfSpeech)) {
            throw new IncorrectPartOfSpeechException(ALLOWED_PARTS_OF_SPEECH, partOfSpeech);
        }
    }

    public void validateSize(Integer size) {
        if(size <= 0 || size > 100) {
            throw new IncorrectPageSizeException(size);
        }
    }

    public void validateWordStatus(String status) {
        if(status != null && !status.equals("LEARNED") && !status.equals("UNLEARNED")) {
            throw new NoSuchStatusException(status);
        }
    }

    public void validatePage(Integer page, Integer totalPages) {
        int maxPage = Math.max(totalPages - 1, 0);
        if(page < 0 || page > maxPage) {
            throw new NoSuchPageException(page, maxPage);
        }
    }
}
