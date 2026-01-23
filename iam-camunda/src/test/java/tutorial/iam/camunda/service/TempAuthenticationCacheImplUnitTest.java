package tutorial.iam.camunda.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;

@ExtendWith(MockitoExtension.class)
public class TempAuthenticationCacheImplUnitTest {

    @InjectMocks
    private TempAuthenticationCacheImpl tempAuthenticationCache;

    @Test
    public void noAuthenticateNoStore() {
        tempAuthenticationCache.store("one", "two".getBytes(StandardCharsets.UTF_8), false);
        Assertions.assertTrue(tempAuthenticationCache.load("one").isEmpty());
    }

    @Test
    public void storeAndLoad() {
        tempAuthenticationCache.store("three", "four".getBytes(StandardCharsets.UTF_8), true);
        Assertions.assertEquals(
                "four" ,
                new String(tempAuthenticationCache.load("three").get(), StandardCharsets.UTF_8));
    }
}
