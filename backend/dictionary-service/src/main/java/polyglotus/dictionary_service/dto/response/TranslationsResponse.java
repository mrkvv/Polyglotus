package polyglotus.dictionary_service.dto.response;

import polyglotus.dictionary_service.dto.BloomHubTranslationGroup;

import java.util.List;
import java.util.Map;

public record TranslationsResponse(
        String word,
        List<Translation> inUserDictionary,
        List<BloomHubTranslationGroup> inCatalog
) {
    public record Translation(Integer id, String ru, String partOfSpeech) {
        public static Translation fromMap(Map<String, Object> map) {
            Integer id = (Integer) map.get("id");
            String ru = (String) map.get("translation");
            String partOfSpeech = (String) map.get("part_of_speech");

            return new Translation(id, ru, partOfSpeech);
        }
    }
}
