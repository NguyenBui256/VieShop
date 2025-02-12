package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.ShopDTO;
import edu.proptit.vieshop.model.orders.PaymentTransaction;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PaymentService {
    List<PaymentTransaction> findAll();
    PaymentTransaction findById(Long id);
    List<PaymentTransaction> findByUserId(Long userId);
    String createPayment(PaymentTransaction shop);
}
