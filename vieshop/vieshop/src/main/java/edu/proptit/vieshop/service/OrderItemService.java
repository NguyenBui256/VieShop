package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.orders.OrderItem;
import edu.proptit.vieshop.model.products.Category;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> findOrderItemByOrderId(Long orderId);
    OrderItem createOrderItem(OrderItem orderItem);
    String updateOrderItem(Long id, OrderItem orderItem);
    String deleteOrderItem(Long id);
}
