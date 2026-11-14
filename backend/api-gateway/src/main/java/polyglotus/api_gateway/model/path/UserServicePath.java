package polyglotus.api_gateway.model.path;

import polyglotus.api_gateway.model.Action;

public enum UserServicePath implements Path {
    LOGIN("/auth/yandex", Action.LOGIN),
    LOGOUT("/auth/logout", Action.LOGOUT),
    ONBOARDING("/users/me/onboarding", Action.OTHER),
    USERS_ME("/users/me", Action.GET_USER_INFO),
    USERS_ME_LEVEL("/users/me/level", Action.CHANGE_USER_DATA),
    USERS_ME_AVATAR("/users/me/avatar", Action.CHANGE_USER_DATA),
    USERS_ME_TOPICS("/users/me/topics", Action.CHANGE_USER_DATA),
    USERS_ME_THEME("/users/me/theme", Action.CHANGE_USER_DATA),
    REFERENCES("/references", Action.GET_REFERENCES);

    private final String path;
    private final Action action;

    UserServicePath(String path, Action action) {
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
