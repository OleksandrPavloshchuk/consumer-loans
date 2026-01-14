package tutorial.camunda.consumer.loans.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    @Override
    public String createAccessToken(String user) {
        // TODO
        return "";
    }

    @Override
    public String createRefreshToken(String user) {
        // TODO
        return "";
    }
}
