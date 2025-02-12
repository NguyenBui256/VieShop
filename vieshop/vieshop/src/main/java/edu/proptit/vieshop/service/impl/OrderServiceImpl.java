package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.OrderRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.OrderService;
import edu.proptit.vieshop.websocket.NotificationService;
import lombok.AllArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@AllArgsConstructor
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
        return orderRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }
}
