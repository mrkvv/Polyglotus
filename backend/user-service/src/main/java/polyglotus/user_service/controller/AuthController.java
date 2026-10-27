package polyglotus.user_service.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import polyglotus.user_service.dto.response.AuthResponse;
import polyglotus.user_service.dto.response.YandexInfoResponse;
import polyglotus.user_service.dto.request.YandexLoginRequest;
import polyglotus.user_service.exception.NoAccessTokenFoundException;
import polyglotus.user_service.service.UserService;
import polyglotus.user_service.service.YandexAuthService;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final YandexAuthService yandexAuthService;
    private final UserService userService;

    public AuthController(YandexAuthService yandexAuthService, UserService userService) {
        this.yandexAuthService = yandexAuthService;
        this.userService = userService;
    }

    @GetMapping("/yandex")
    public ResponseEntity<Void> startYandexLogin() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(yandexAuthService.buildAuthorizeUrl()))
                .build();
    }

    @PostMapping("/yandex")
    public ResponseEntity<AuthResponse> login(@RequestBody YandexLoginRequest request) {
        String token = yandexAuthService.getYandexToken(request.code());
        YandexInfoResponse response = yandexAuthService.getYandexUserInfo(token);

        return ResponseEntity.ok(userService.login(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        if(authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            throw new NoAccessTokenFoundException();
        }

        String token = authHeader.substring(BEARER_PREFIX.length());
        userService.logout(token);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .build();
    }
}
