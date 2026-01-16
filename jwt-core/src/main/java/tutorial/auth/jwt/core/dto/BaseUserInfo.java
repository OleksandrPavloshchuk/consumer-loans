package tutorial.auth.jwt.core.dto;

import java.util.Set;

public record BaseUserInfo(String name, String password, Set<String> roles) {
}
