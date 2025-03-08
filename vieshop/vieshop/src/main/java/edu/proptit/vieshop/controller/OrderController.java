package edu.proptit.vieshop.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.proptit.vieshop.common.NotificationStatus;
import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.service.OrderService;
import edu.proptit.vieshop.service.websocket.Notification;
import edu.proptit.vieshop.service.websocket.WebsocketService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;
    private final WebsocketService notificationService;

    @PostMapping("/v1/orders/{userId}")
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

    @GetMapping("/admin/orders")
    public CustomResponse<Page<Order>> findAll(
            @RequestParam(required = false, defaultValue = "20") Integer size,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "id") String sortBy,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        if (search != null && !search.isEmpty() || status != null && !status.isEmpty()) {
            return new CustomResponse<Page<Order>>().data(orderService.searchOrders(search, status, size, page, sortBy));
        } else {
            return new CustomResponse<Page<Order>>().data(orderService.findAll(size, page, sortBy));
        }
    }

    @GetMapping("/v1/orders/belong-to-user/{userId}")
    public CustomResponse<?> getOrderFromUser(@PathVariable Long userId) {
        return new CustomResponse<>().data(orderService.findByUserId(userId));
    }

    @GetMapping("/v1/orders/{id}")
    public CustomResponse<?> getOrder(@PathVariable Long id) {
        return new CustomResponse<>().data(orderService.findById(id));
    }

    @PostMapping("/v1/orders")
    public CustomResponse<?> createOrder(@RequestBody Order order) {
        return new CustomResponse<>().data(orderService.createOrder(order));
    }
    
    // New endpoints for admin dashboard
    @GetMapping("/admin/orders/recent")
    public CustomResponse<?> getRecentOrders(@RequestParam(required = false, defaultValue = "5") Integer limit) {
        return new CustomResponse<>().data(orderService.getRecentOrders(limit));
    }
    
    @GetMapping("/admin/orders/{id}")
    public CustomResponse<?> getOrderAdmin(@PathVariable Long id) {
        return new CustomResponse<>().data(orderService.findById(id));
    }
    
    @PutMapping("/admin/orders/{id}/status")
    public CustomResponse<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.getOrDefault("status", "");
        return new CustomResponse<>().message(orderService.updateOrderStatus(id, status));
    }
    
    @DeleteMapping("/admin/orders/{id}")
    public CustomResponse<?> deleteOrder(@PathVariable Long id) {
        return new CustomResponse<>().message(orderService.deleteOrder(id));
    }
}
