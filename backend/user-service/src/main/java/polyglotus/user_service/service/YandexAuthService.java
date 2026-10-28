package polyglotus.user_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import polyglotus.user_service.dto.response.YandexInfoResponse;
import polyglotus.user_service.dto.response.YandexTokenResponse;
import polyglotus.user_service.exception.NoYandexAccessTokenFoundException;

@Service
public class YandexAuthService {

    private static final String AUTHORIZE_URL = "https://oauth.yandex.ru/authorize";
    private static final String TOKEN_URL = "https://oauth.yandex.ru/token";
    private static final String INFO_URL = "https://login.yandex.ru/info";

    private static final String GRANT_TYPE_PARAM = "grant_type";
    private static final String CODE_PARAM = "code";
    private static final String CLIENT_ID_PARAM = "client_id";
    private static final String CLIENT_SECRET_PARAM = "client_secret";
    private static final String AUTHORIZATION_CODE_GRANT = "authorization_code";

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String OAUTH_PREFIX = "OAuth ";

    private final RestClient restClient;

    @Value("${yandex.client-id}")
    private String clientId;

    @Value("${yandex.redirect-uri}")
    private String redirectUri;

    @Value("${yandex.client-secret}")
    private String clientSecret;

    public YandexAuthService(RestClient restClient) {
        this.restClient = restClient;
    }

    public String buildAuthorizeUrl() {
        return AUTHORIZE_URL
                + "?response_type=code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&scope=login:info";
    }

    public String getYandexToken(String code) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add(GRANT_TYPE_PARAM, AUTHORIZATION_CODE_GRANT);
        form.add(CODE_PARAM, code);
        form.add(CLIENT_ID_PARAM, clientId);
        form.add(CLIENT_SECRET_PARAM, clientSecret);

        YandexTokenResponse response = restClient.post()
                .uri(TOKEN_URL)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(YandexTokenResponse.class);

        if(response == null
                || response.accessToken() == null
                || response.accessToken().isBlank()
        ) {
            throw new NoYandexAccessTokenFoundException();
        }

        return response.accessToken();
    }

    public YandexInfoResponse getYandexUserInfo(String token) {
        return restClient.get()
                .uri(INFO_URL)
                .header(AUTHORIZATION_HEADER, OAUTH_PREFIX + token)
                .retrieve()
                .body(YandexInfoResponse.class);
    }
}
