package tutorial.iam.camunda.service;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.identity.Group;
import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.AuthorizationService;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CamundaAuthorizationService implements AuthorizationService {

    private final IdentityService identityService;

    @Override
    public Set<String> getRoles(String username) {
        return Set.of("CAMUNDA_USER");
    }

    @Override
    public Set<String> getGroups(String username) {
        return identityService.createGroupQuery()
                .groupMember(username)
                .list()
                .stream()
                .map(Group::getId)
                .collect(Collectors.toSet());
    }
}