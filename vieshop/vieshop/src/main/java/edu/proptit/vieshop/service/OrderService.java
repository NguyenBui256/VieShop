package edu.proptit.vieshop.service;

import java.util.List;

import org.springframework.data.domain.Page;

import edu.proptit.vieshop.model.orders.Order;

public interface OrderService {
    Page<Order> findAll(int size, int page, String sortBy);
    Order findById(Long id);
    List<Order> findByUserId(Long id);
    Order createOrder(Order order);
    
    // New methods for admin dashboard
    Page<Order> searchOrders(String query, String status, int size, int page, String sortBy);
    String updateOrderStatus(Long id, String status);
    String deleteOrder(Long id);
    List<Order> getRecentOrders(int limit);
}
