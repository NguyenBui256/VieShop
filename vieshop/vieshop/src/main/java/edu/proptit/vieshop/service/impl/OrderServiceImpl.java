package edu.proptit.vieshop.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import edu.proptit.vieshop.dao.OrderRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.service.OrderService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    @Override
    public Page<Order> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        List<Order> list = orderRepository.findAll();
        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @Override
    public List<Order> findByUserId(Long id) {
        return orderRepository.findByUserId(id);
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    // New methods for admin dashboard
    
    @Override
    public Page<Order> searchOrders(String query, String status, int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        
        List<Order> allOrders = orderRepository.findAll();
        List<Order> filteredOrders;
        
        // Apply filters
        if (query != null && !query.isEmpty() && status != null && !status.isEmpty()) {
            // Filter by both query and status
            filteredOrders = allOrders.stream()
                    .filter(order -> order.getId().toString().contains(query))
                    .filter(order -> order.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        } else if (query != null && !query.isEmpty()) {
            // Filter by query only
            filteredOrders = allOrders.stream()
                    .filter(order -> order.getId().toString().contains(query))
                    .collect(Collectors.toList());
        } else if (status != null && !status.isEmpty()) {
            // Filter by status only
            filteredOrders = allOrders.stream()
                    .filter(order -> order.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        } else {
            // No filters
            filteredOrders = allOrders;
        }
        
        return new PageImpl<>(filteredOrders, pageable, filteredOrders.size());
    }

    @Override
    public String updateOrderStatus(Long id, String status) {
        Order order = findById(id);
        order.setStatus(status);
        orderRepository.save(order);
        return "Order status updated successfully";
    }

    @Override
    public String deleteOrder(Long id) {
        Order order = findById(id);
        orderRepository.delete(order);
        return "Order deleted successfully";
    }

    @Override
    public List<Order> getRecentOrders(int limit) {
        // Get all orders and sort by creation date (descending)
        List<Order> allOrders = orderRepository.findAll();
        return allOrders.stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
