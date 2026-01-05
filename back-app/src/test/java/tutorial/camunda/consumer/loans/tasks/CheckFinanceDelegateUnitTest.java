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
import tutorial.camunda.consumer.loans.services.CheckFinanceService;
import tutorial.camunda.consumer.loans.services.ExternalSystemUnavailableException;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CheckFinanceDelegateUnitTest {

    @Mock
    private CheckFinanceService checkFinanceService;

    @Mock
    private DelegateExecution delegateExecution;

    @InjectMocks
    private CheckFinanceDelegate checkFinanceDelegate;

    @Test
    public void checkFinance() {
        doReturn("the person")
                .when(delegateExecution)
                .getVariable(VariableNames.personName.name());
        doReturn(23.1)
                .when(delegateExecution)
                .getVariable(VariableNames.amount.name());
        doReturn(new CheckResult(42, List.of("reason1", "reason3")))
                .when(checkFinanceService)
                .check(anyString(), any(BigDecimal.class));
        checkFinanceDelegate.execute(delegateExecution);
        ArgumentCaptor<String> varNameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Object> valueCaptor = ArgumentCaptor.forClass(Object.class);
        verify(delegateExecution, times(2))
                .setVariable(varNameCaptor.capture(), valueCaptor.capture());
        Assertions.assertEquals(List.of("financeCheckScores", "financeCheckReasons"), varNameCaptor.getAllValues());
        Assertions.assertEquals(
                List.of(42, List.of("reason1", "reason3")),valueCaptor.getAllValues());

    }

    @Test
    public void checkServiceIsNotAvailable() {
        doReturn("other person")
                .when(delegateExecution)
                .getVariable(VariableNames.personName.name());
        doReturn(0.01)
                .when(delegateExecution)
                .getVariable(VariableNames.amount.name());
        doThrow( new ExternalSystemUnavailableException("test"))
                .when(checkFinanceService)
                .check(anyString(), any(BigDecimal.class));
        Assertions.assertThrows(BpmnError.class,
                ()-> checkFinanceDelegate.execute(delegateExecution));
    }
}
