package edu.proptit.vieshop.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.orders.PaymentTransaction;
import edu.proptit.vieshop.service.PaymentService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

@RestController
@RequestMapping("/api/v1/payment")
@AllArgsConstructor
public class PaymentController {
  private final PayOS payOS;
  private final PaymentService paymentService;

  @GetMapping("")
  public CustomResponse<?> getAllPayment() {
    return new CustomResponse().data(paymentService.findAll());
  }

  @GetMapping("/{paymentId}")
  public CustomResponse<?> getPayment(@PathVariable("paymentId") Long paymentId) {
    return new CustomResponse().data(paymentService.findById(paymentId));
  }

  @GetMapping("/belong-to-user/{userId}")
  public CustomResponse<?> getPaymentOfUser(@PathVariable("userId") Long userId) {
    return new CustomResponse().data(paymentService.findByUserId(userId));
  }

  @PostMapping("")
  public CustomResponse<?> createPayment(@RequestBody PaymentTransaction paymentTransaction) {
    return new CustomResponse<>().message(paymentService.createPayment(paymentTransaction));
  }
}
