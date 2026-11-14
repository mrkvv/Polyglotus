package polyglotus.api_gateway.model.path;

import polyglotus.api_gateway.model.Action;

public enum TrainingServicePath implements Path {
    TRAINING_TRANSLATE("/training/translate", Action.GET_TRAINING_BASE),
    TRAINING_MATCH("/training/match", Action.GET_TRAINING_BASE),
    TRAINING_FILL("/training/fill", Action.GET_TRAINING_FILLING),
    MARK_CORRECT("/training/mark-correct", Action.MARK_CORRECT);

    private final String path;
    private final Action action;

    TrainingServicePath(String path, Action action) {
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
