package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.PaymentDTO;
import edu.proptit.vieshop.dto.ShopDTO;
import edu.proptit.vieshop.model.orders.PaymentTransaction;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PaymentService {
    List<PaymentTransaction> findAll();
    PaymentTransaction findById(Long id);
    PaymentTransaction findByTransactionId(String transactionId);
    List<PaymentTransaction> findByUserId(Long userId);
    String createPayment(PaymentDTO paymentDTO);
    void updatePayment(PaymentTransaction paymentTransaction);
}
