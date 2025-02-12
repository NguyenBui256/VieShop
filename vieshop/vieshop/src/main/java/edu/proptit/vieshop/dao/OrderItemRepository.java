package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.model.orders.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query(value = "SELECT * from orderitems o where o.order_id = :orderId", nativeQuery = true)
    List<OrderItem> findOrderItemByOrderId(@Param("{orderId}") Long orderId);
}
