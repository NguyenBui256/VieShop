package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.products.ProductVariant;
import edu.proptit.vieshop.model.products.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query(value = "SELECT * FROM reviews r where r.product_id = :productId and r.is_delete = 0", nativeQuery = true)
    List<Review> findByProductId(@Param("productId") Long productId);

}
