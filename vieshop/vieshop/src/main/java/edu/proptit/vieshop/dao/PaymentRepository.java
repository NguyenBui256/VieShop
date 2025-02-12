package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.orders.PaymentTransaction;
import edu.proptit.vieshop.model.products.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentTransaction, Long> {
    @Query(value = "SELECT * FROM paymenttransactions p where p.user_id = :userId", nativeQuery = true)
    List<PaymentTransaction> findByUserId(@Param("userId") Long userId);
}
