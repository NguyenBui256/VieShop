package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.service.OrderService;
import edu.proptit.vieshop.websocket.Notification;
import edu.proptit.vieshop.websocket.NotificationService;
import edu.proptit.vieshop.common.NotificationStatus;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;
    private final NotificationService notificationService;

    @PostMapping("/{userId}")
    public void testNoti(@PathVariable Long userId) {
        notificationService.sendNotification(
                userId.toString(),
                Notification.builder()
                        .status(NotificationStatus.NEW_ORDER)
                        .message("Test")
                        .title("Test")
                        .build()
        );
    }

    @GetMapping("/belong-to-user/{userId}")
    public CustomResponse<?> getOrderFromUser(@PathVariable Long userId) {
        return new CustomResponse<>().data(orderService.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public CustomResponse<?> getOrder(@PathVariable Long id) {
        return new CustomResponse<>().data(orderService.findById(id));
    }

    @PostMapping("")
    public CustomResponse<?> createOrder(@RequestBody Order order) {
        return new CustomResponse<>().data(orderService.createOrder(order));
    }
}
