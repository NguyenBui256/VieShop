package edu.proptit.vieshop.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import edu.proptit.vieshop.dto.CreatePaymentLinkRequestBody;
import edu.proptit.vieshop.model.orders.PaymentTransaction;
import edu.proptit.vieshop.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/order-payos")
@RequiredArgsConstructor
public class OrderPayOSController {
    private final PayOS payOS;
    private final PaymentService paymentService;

    @GetMapping("/{orderId}")
    public ObjectNode getOrderById(@PathVariable("orderId") long orderId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            PaymentLinkData order = payOS.getPaymentLinkInformation(orderId);

            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "ok");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }

    }

    @PostMapping(path = "/create")
    public ObjectNode createPaymentLink(@RequestBody CreatePaymentLinkRequestBody RequestBody) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            final String productName = RequestBody.getProductName();
            final String description = RequestBody.getDescription();
            final String returnUrl = RequestBody.getReturnUrl();
            final String cancelUrl = RequestBody.getCancelUrl();
            final int price = RequestBody.getPrice();
            // Gen order code
            String currentTimeString = String.valueOf(new Date().getTime());
            long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));

            ItemData item = ItemData.builder().name(productName).price(price).quantity(1).build();

            PaymentData paymentData = PaymentData.builder().orderCode(orderCode).description(description).amount(price)
                    .item(item).returnUrl(returnUrl).cancelUrl(cancelUrl).build();

            CheckoutResponseData data = payOS.createPaymentLink(paymentData);

            response.put("error", 0);
            response.put("message", "success");
            response.set("data", objectMapper.valueToTree(data));
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", "fail");
            response.set("data", null);
            return response;

        }
    }

    @PutMapping("/cancel/{transactionId}")
    public ObjectNode cancelOrder(@PathVariable("transactionId") int transactionId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            PaymentLinkData order = payOS.cancelPaymentLink(transactionId, null);
            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "ok");

            // Update transaction status to DB
            PaymentTransaction payment = paymentService.findByTransactionId(String.valueOf(transactionId));
            payment.setStatus("CANCEL");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentService.updatePayment(payment);

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }

    @PostMapping(path = "/payos_transfer_handler")
    public ObjectNode payosTransferHandler(@RequestBody ObjectNode body)
            throws IllegalArgumentException, JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        body.put("success", true);
        Webhook webhookBody = objectMapper.treeToValue(body, Webhook.class);

        try {
            // Init Response
            response.put("error", 0);
            response.put("message", "Webhook delivered");
            response.set("data", null);

            // Update transaction status to DB
            String transactionId = String.valueOf(body.get("data").get("orderCode"));

            payOS.verifyPaymentWebhookData(webhookBody);
            PaymentTransaction payment = paymentService.findByTransactionId(transactionId);
            payment.setStatus("PAID");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentService.updatePayment(payment);

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }

}
