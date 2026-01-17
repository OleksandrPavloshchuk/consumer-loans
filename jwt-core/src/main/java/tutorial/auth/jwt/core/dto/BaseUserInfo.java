package tutorial.auth.jwt.core.dto;

import java.util.Set;

@Deprecated
public record BaseUserInfo(String name, String password, Set<String> roles) {
}
