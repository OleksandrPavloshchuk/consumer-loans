package tutorial.camunda.consumer.loans.services;

public class ExternalSystemUnavailableException extends RuntimeException {
    public ExternalSystemUnavailableException(String message) {
        super(message);
    }
}
