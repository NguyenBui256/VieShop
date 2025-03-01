package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.model.products.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Query(value = "SELECT * FROM product_variants p where p.product_id = :productId and p.is_delete = 0", nativeQuery = true)
    List<ProductVariant> findByProductId(@Param("productId") Long productId);

    @Query(value = "SELECT * FROM product_variants p where p.parent_id = :parentId and p.is_delete = 0", nativeQuery = true)
    List<ProductVariant> findByParentId(@Param("parentId") Long parentId);
}
