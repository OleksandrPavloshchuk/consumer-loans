package tutorial.camunda.consumer.loans.tasks;

import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tutorial.camunda.consumer.loans.domain.CheckResult;
import tutorial.camunda.consumer.loans.domain.VariableNames;
import tutorial.camunda.consumer.loans.services.CheckPersonService;
import tutorial.camunda.consumer.loans.services.ExternalSystemUnavailableException;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CheckPersonDelegateUnitTest {

    @Mock
    private CheckPersonService checkPersonService;

    @Mock
    private DelegateExecution delegateExecution;

    @InjectMocks
    private CheckPersonDelegate checkPersonDelegate;

    @Test
    public void checkFinance() {
        doReturn("the person")
                .when(delegateExecution)
                .getVariable(VariableNames.personName.name());
        doReturn(new CheckResult(9500, List.of("reason11")))
                .when(checkPersonService)
                .check(anyString());
        checkPersonDelegate.execute(delegateExecution);
        ArgumentCaptor<String> varNameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Object> valueCaptor = ArgumentCaptor.forClass(Object.class);
        verify(delegateExecution, times(2))
                .setVariable(varNameCaptor.capture(), valueCaptor.capture());
        Assertions.assertEquals(List.of("personCheckScores", "personCheckReasons"), varNameCaptor.getAllValues());
        Assertions.assertEquals(
                List.of(9500, List.of("reason11")),valueCaptor.getAllValues());

    }

    @Test
    public void checkServiceIsNotAvailable() {
        doReturn("other person")
                .when(delegateExecution)
                .getVariable(VariableNames.personName.name());
        doThrow( new ExternalSystemUnavailableException("test"))
                .when(checkPersonService)
                .check(anyString());
        Assertions.assertThrows(BpmnError.class,
                ()-> checkPersonDelegate.execute(delegateExecution));
    }
}
