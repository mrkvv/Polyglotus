package polyglotus.api_gateway.model.path;

import polyglotus.api_gateway.model.Action;

public enum AiServicePath implements Path {
    CHAT("/ai/chat", Action.AI_CHAT);

    private final String path;
    private final Action action;

    AiServicePath(String path, Action action) {
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
