package polyglotus.api_gateway.model.path;

import polyglotus.api_gateway.model.Action;

public enum DictionaryServicePath implements Path {
    DICTIONARY("/dictionary", Action.GET_DICTIONARY),
    WORDS("/dictionary/words/**", Action.CHANGE_WORD),
    STATUS("/dictionary/words/status/**", Action.CHANGE_WORD),
    TRANSLATIONS("/translations", Action.GET_TRANSLATIONS),
    DAILY_WORD("/daily-word", Action.GET_HOME_SCREEN_STAFF),
    PHRASE("/phrase", Action.GET_HOME_SCREEN_STAFF);

    private final String path;
    private final Action action;

    DictionaryServicePath(String path, Action action) {
        this.path = path;
        this.action = action;
    }

    @Override
    public String path() {
        return this.path;
    }

    @Override
    public int limit() {
        return this.action.limit();
    }

    @Override
    public String action() {
        return action.get();
    }
}
