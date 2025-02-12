package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.products.ProductImage;
import edu.proptit.vieshop.model.users.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    @Query(value = "SELECT * FROM productimages p where p.product_id = :productId", nativeQuery = true)
    List<UserAddress> findProductImageByProductId(@Param("productId") Long productId);
}
