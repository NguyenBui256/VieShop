package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.orders.OrderItem;
import edu.proptit.vieshop.service.OrderItemService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/items")
@AllArgsConstructor
public class OrderItemController {
    private final OrderItemService orderItemService;

    @GetMapping("/belong-to-order/{orderId}")
    public CustomResponse<?> getBelongToOrder(@PathVariable Long orderId) {
        return new CustomResponse<>().data(orderItemService.findOrderItemByOrderId(orderId));
    }

    @PostMapping("")
    public CustomResponse<?> addOrderItem(@RequestBody OrderItem orderItem) {
        return new CustomResponse<>().data(orderItemService.createOrderItem(orderItem));
    }

    @PutMapping("/{itemId}")
    public CustomResponse<?> updateOrderItem(@PathVariable Long itemId, @RequestBody OrderItem orderItem) {
        return new CustomResponse<>().message(orderItemService.updateOrderItem(itemId, orderItem));
    }

    @DeleteMapping("/{itemId}")
    public CustomResponse<?> deleteOrderItem(@PathVariable Long itemId) {
        return new CustomResponse<>().message(orderItemService.deleteOrderItem(itemId));
    }
}
