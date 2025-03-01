package edu.proptit.vieshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Setter
@Getter
@Builder
@AllArgsConstructor
public class CustomException extends RuntimeException {
    private String errorCode;
    private HttpStatus httpStatus;
    private String errorMessage;

    private String[] args;

    public CustomException() {
        super();
    }

    public CustomException(String errorCode) {
        this.httpStatus = HttpStatus.OK;
        this.errorCode = errorCode;
    }

    public CustomException(String errorCode, String... args) {
        this.httpStatus = HttpStatus.OK;
        this.errorCode = errorCode;
        this.args = args;
    }

    public CustomException(HttpStatus httpStatus, String errorCode, String... args) {
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.args = args;
    }

    public CustomException(HttpStatus httpStatus, String errorMessage) {
        this.errorMessage = errorMessage;
        this.httpStatus = httpStatus;
    }

    public CustomException notFound(String type) {
        this.httpStatus = HttpStatus.NOT_FOUND;
        this.errorCode = "404";
        this.errorMessage = type + " not found";
        return this;
    }
}
