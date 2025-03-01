package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.ShopDTO;
import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    Page<Order> findAll(int size, int page, String sortBy);
    Order findById(Long id);
    List<Order> findByUserId(Long id);
    Order createOrder(Order order);
}
