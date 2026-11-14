package polyglotus.api_gateway.service;

import org.springframework.util.AntPathMatcher;
import polyglotus.api_gateway.model.path.*;

import java.util.*;
import java.util.stream.Stream;

public class PathRegistry {

    private static final AntPathMatcher MATCHER = new AntPathMatcher();

    private static final Map<String, Path> EXACT_PATHS;
    private static final List<Path> WILDCARD_PATHS;

    static {
        List<Path> allPaths = Stream.<Path[]>of(
                AiServicePath.values(),
                DictionaryServicePath.values(),
                TrainingServicePath.values(),
                UserServicePath.values()
        ).flatMap(Stream::of).toList();

        Map<String, Path> exact = new HashMap<>();
        List<Path> wildcards = new ArrayList<>();

        for (Path path : allPaths) {
            if (path.path().contains("*")) {
                wildcards.add(path);
            } else {
                exact.put(path.path(), path);
            }
        }
        wildcards.sort(Comparator.comparingInt((Path p) -> p.path().length()).reversed());

        EXACT_PATHS = Map.copyOf(exact);
        WILDCARD_PATHS = List.copyOf(wildcards);
    }

    private PathRegistry() {}

    public static Path resolve(String requestPath) {
        Path result = EXACT_PATHS.get(requestPath);
        if (result == null) {
            result = WILDCARD_PATHS.stream()
                    .filter(p -> MATCHER.match(p.path(), requestPath))
                    .findFirst()
                    .get();
        }

        return result;
    }
}
