package edu.proptit.vieshop.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"status_code", "data", "message"})
public class CustomResponse<T> implements Serializable {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String statusCode;
    private T data;
    private String message;

    public CustomResponse(String message) {
        this.message = message;
    }

    public CustomResponse<T> data(T data){
        this.data = data;
        return this;
    }

    public CustomResponse<T> statusCode(String statusCode){
        this.statusCode = statusCode;
        return this;
    }

    public CustomResponse<T> message(String message){
        this.message = message;
        return this;
    }
}