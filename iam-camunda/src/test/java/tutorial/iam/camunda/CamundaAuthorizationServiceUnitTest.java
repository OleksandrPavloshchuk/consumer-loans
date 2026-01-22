package tutorial.iam.camunda;

import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.identity.Group;
import org.camunda.bpm.engine.identity.GroupQuery;
import org.camunda.bpm.engine.identity.User;
import org.camunda.bpm.engine.identity.UserQuery;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class CamundaAuthorizationServiceUnitTest {

    @Mock
    private IdentityService identityService;

    @Mock
    private GroupQuery groupQuery;

    @Mock
    private Group group;

    @InjectMocks
    private CamundaAuthorizationService authorizationService;

    @Test
    public void getRoles() {
        Assertions.assertEquals(
                authorizationService.getRoles("any user"),
                Set.of("CAMUNDA_USER"));
    }

    @Test
    public void getGroups() {
        doReturn(groupQuery).when(identityService).createGroupQuery();
        doReturn(groupQuery).when(groupQuery).groupMember(any());
        doReturn(List.of(group)).when(groupQuery).list();
        doReturn("The Group").when(group).getId();
        Assertions.assertEquals(
                authorizationService.getGroups("any user"),
                Set.of("The Group"));
    }

}
