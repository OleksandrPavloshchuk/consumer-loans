package tutorial.iam.camunda.service;

import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.identity.User;
import org.camunda.bpm.engine.identity.UserQuery;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class CamundaAuthenticationServiceUnitTest {

    @Mock
    private IdentityService identityService;

    @Mock
    private UserQuery userQuery;

    @Mock
    private User user;

    @Mock
    private TempAuthenticationCache tempAuthenticationCache;

    @InjectMocks
    private CamundaAuthenticationService authenticationService;

    @Test
    public void noUser() {
        initIdentityService(null);
        Assertions.assertFalse( authenticationService.isAuthenticated(
                "hello",
                "world".getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    public void wrongPassword() {
        initIdentityService(user);
        doReturn(false).when(identityService).checkPassword(any(), anyString());
        Assertions.assertFalse( authenticationService.isAuthenticated(
                "hello",
                "world".getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    public void correctPassword() {
        initIdentityService(user);
        doReturn(true).when(identityService).checkPassword("hello", "world");
        Assertions.assertTrue( authenticationService.isAuthenticated(
                "hello",
                "world".getBytes(StandardCharsets.UTF_8)));
    }

    private void initIdentityService(Object singleResult) {
        doReturn(userQuery).when(identityService).createUserQuery();
        doReturn(userQuery).when(userQuery).userId(any());
        doReturn(singleResult).when(userQuery).singleResult();
    }

}
