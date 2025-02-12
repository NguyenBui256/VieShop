package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.OrderItemRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.orders.OrderItem;
import edu.proptit.vieshop.service.OrderItemService;
import edu.proptit.vieshop.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {
    private final OrderItemRepository orderItemRepository;

    @Override
    public List<OrderItem> findOrderItemByOrderId(Long orderId) {
        return orderItemRepository.findOrderItemByOrderId(orderId);
    }

    @Override
    public String createOrderItem(OrderItem orderItem) {
        orderItemRepository.save(orderItem);
        return "Item added!";
    }

    @Override
    public String updateOrderItem(Long id, OrderItem orderItem) {
        OrderItem orderItemDB = orderItemRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Item not found"));
        orderItemDB.setProductId(orderItem.getProductId());
        orderItemDB.setQuantity(orderItem.getQuantity());
        orderItemDB.setVariantId(orderItem.getVariantId());
        orderItemRepository.save(orderItemDB);
        return "Item updated!";
    }

    @Override
    public String deleteOrderItem(Long id) {
        OrderItem orderItemDB = orderItemRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Item not found"));
        orderItemDB.setIsDelete(true);
        orderItemRepository.save(orderItemDB);
        return "Item deleted!";
    }
}
