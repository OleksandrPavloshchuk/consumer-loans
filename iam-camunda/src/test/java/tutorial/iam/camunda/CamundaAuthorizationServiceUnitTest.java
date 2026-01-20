package tutorial.iam.camunda;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

@ExtendWith(MockitoExtension.class)
public class CamundaAuthorizationServiceUnitTest {

    @InjectMocks
    private CamundaAuthorizationService authorizationService;

    @Test
    public void getRoles() {
        Assertions.assertEquals(
                authorizationService.getRoles("any user"),
                Set.of("CAMUNDA_USER"));
    }
}
