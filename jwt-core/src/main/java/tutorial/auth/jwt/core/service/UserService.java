package tutorial.auth.jwt.core.service;

import tutorial.auth.jwt.core.dto.BaseUserInfo;

import java.util.Optional;

public interface UserService {
    Optional<BaseUserInfo> getUser(String name);
}
