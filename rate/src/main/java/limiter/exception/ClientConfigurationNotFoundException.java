package limiter.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;


public class ClientConfigurationNotFoundException
        extends RuntimeException {

    public ClientConfigurationNotFoundException(String message){
        super(message);
    }

}
