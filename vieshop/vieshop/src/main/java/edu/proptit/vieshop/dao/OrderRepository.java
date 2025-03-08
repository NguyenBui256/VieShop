package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.model.orders.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query(value = "SELECT * FROM orders o where o.user_id = :userId and o.is_delete = 0", nativeQuery = true)
    List<Order> findByUserId(@Param("userId") Long userId);

    List<Order> findByCreatedAtAfter(LocalDateTime date);

}
