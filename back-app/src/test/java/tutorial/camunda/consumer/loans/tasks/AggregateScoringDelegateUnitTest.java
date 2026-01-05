package tutorial.camunda.consumer.loans.tasks;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tutorial.camunda.consumer.loans.domain.CheckResult;
import tutorial.camunda.consumer.loans.domain.Decision;
import tutorial.camunda.consumer.loans.domain.ScoringResult;
import tutorial.camunda.consumer.loans.domain.VariableNames;
import tutorial.camunda.consumer.loans.services.AggregateScoringService;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AggregateScoringDelegateUnitTest {

    @Mock
    private AggregateScoringService aggregateScoringService;

    @Mock
    private DelegateExecution delegateExecution;

    @InjectMocks
    private AggregateScoringDelegate aggregateScoringDelegate;

    @Test
    public void manualDecision() {
        defineInputParameters();

        doReturn(new CheckResult(55, List.of("one", "ten")))
                .when(aggregateScoringService)
                .aggregate(any(Map.class));

        aggregateScoringDelegate.execute(delegateExecution);

        ArgumentCaptor<String> namesCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Object> valsCaptor = ArgumentCaptor.forClass(Object.class);
        verify(delegateExecution, times(3)).setVariable(namesCaptor.capture(), valsCaptor.capture());
        Assertions.assertEquals(
                List.of("totalScores", "totalReasons", "scoringResult"),
                namesCaptor.getAllValues());
        Assertions.assertEquals(
                List.of(55, List.of("one", "ten"), ScoringResult.MANUAL),
                valsCaptor.getAllValues());

    }

    @Test
    public void autoApprove() {
        defineInputParameters();

        doReturn(new CheckResult(95, List.of()))
                .when(aggregateScoringService)
                .aggregate(any(Map.class));

        aggregateScoringDelegate.execute(delegateExecution);

        ArgumentCaptor<String> namesCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Object> valsCaptor = ArgumentCaptor.forClass(Object.class);
        verify(delegateExecution, times(4)).setVariable(namesCaptor.capture(), valsCaptor.capture());
        Assertions.assertEquals(
                List.of("totalScores", "totalReasons", "scoringResult", "decision"),
                namesCaptor.getAllValues());
        Assertions.assertEquals(
                List.of(95, List.of(), ScoringResult.AUTO_APPROVE, Decision.APPROVE),
                valsCaptor.getAllValues());

    }

    @Test
    public void autoRejsct() {
        defineInputParameters();

        doReturn(new CheckResult(29, List.of("hello world!")))
                .when(aggregateScoringService)
                .aggregate(any(Map.class));

        aggregateScoringDelegate.execute(delegateExecution);

        ArgumentCaptor<String> namesCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Object> valsCaptor = ArgumentCaptor.forClass(Object.class);
        verify(delegateExecution, times(4)).setVariable(namesCaptor.capture(), valsCaptor.capture());
        Assertions.assertEquals(
                List.of("totalScores", "totalReasons", "scoringResult", "decision"),
                namesCaptor.getAllValues());
        Assertions.assertEquals(
                List.of(29, List.of("hello world!"), ScoringResult.AUTO_REJECT, Decision.REJECT),
                valsCaptor.getAllValues());

    }

    private void defineInputParameters() {
        doReturn(20)
                .when(delegateExecution)
                .getVariable(VariableNames.financeCheckScores.name());
        doReturn(List.of("no money"))
                .when(delegateExecution)
                .getVariable(VariableNames.financeCheckReasons.name());
        doReturn(35)
                .when(delegateExecution)
                .getVariable(VariableNames.personCheckScores.name());
        doReturn(List.of("you are bad"))
                .when(delegateExecution)
                .getVariable(VariableNames.personCheckReasons.name());

    }

}
