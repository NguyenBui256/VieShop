package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.OrderRepository;
import edu.proptit.vieshop.dao.PaymentRepository;
import edu.proptit.vieshop.dao.ProductsRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.model.orders.OrderItem;
import edu.proptit.vieshop.model.orders.PaymentTransaction;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.service.PaymentService;
import edu.proptit.vieshop.websocket.Notification;
import edu.proptit.vieshop.websocket.NotificationService;
import edu.proptit.vieshop.common.NotificationStatus;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;
    private final OrderRepository orderRepository;
    private final ProductsRepository productsRepository;

    @Override
    public List<PaymentTransaction> findAll() {
        return paymentRepository.findAll();
    }

    @Override
    public PaymentTransaction findById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Payment not found"));
    }

    @Override
    public List<PaymentTransaction> findByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public String createPayment(PaymentTransaction payment) {
        paymentRepository.save(payment);
        Order order = orderRepository.findById(payment.getOrderId()).get();
        for(OrderItem orderItem : order.getOrderItems()) {
            Product product = productsRepository.findById(orderItem.getProductId()).get();
            notificationService.sendNotification(
                    product.getShop().getUser().getId().toString(),
                    Notification.builder()
                            .status(NotificationStatus.NEW_ORDER)
                            .message(String.format("Cua hang %s da co them don hang moi - %s", product.getShop().getName(), product.getName()))
                            .title(product.getShop().getName())
                            .build()

            );
        }

        return "Payment saved";
    }
}
