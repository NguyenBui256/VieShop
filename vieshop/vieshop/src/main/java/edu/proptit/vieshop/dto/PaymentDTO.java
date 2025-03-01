package edu.proptit.vieshop.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentDTO {
    private Long orderId;
    private Long userId;
    private String transactionId;
    private BigDecimal amount;
    private String status;
    private String description;
    private String checkoutUrl;
    private LocalDateTime createdAt;
}