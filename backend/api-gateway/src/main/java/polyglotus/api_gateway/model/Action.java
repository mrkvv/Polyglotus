package polyglotus.api_gateway.model;

public enum Action {
    LOGIN("login", 15),
    LOGOUT("logout", 15),
    GET_REFERENCES("references", 15),
    GET_USER_INFO("info", 30),
    CHANGE_USER_DATA("change-data", 30),

    AI_CHAT("ai-chat", 20),

    GET_TRAINING_BASE("training-base", 20),
    GET_TRAINING_FILLING("training-filling", 15),
    MARK_CORRECT("mark-correct", 20),

    GET_DICTIONARY("dictionary", 40),
    CHANGE_WORD("change-word", 50),
    GET_TRANSLATIONS("translations", 40),
    GET_HOME_SCREEN_STAFF("home-screen-staff", 40),
    OTHER("other", 30);

    private final String action;
    private final int limit;

    Action(String action, int limit) {
        this.action = action;
        this.limit = limit;
    }

    public String get() {
        return this.action;
    }

    public int limit() {
        return this.limit;
    }
}
