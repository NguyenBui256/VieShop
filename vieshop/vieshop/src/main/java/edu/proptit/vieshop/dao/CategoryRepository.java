package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.model.products.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query(value = "SELECT * FROM categories c where c.is_sample = 0 or (c.shop_id = :shopId and c.is_delete = 0)", nativeQuery = true)
    List<Category> findByShopId(@Param("shopId") Long shopId);
}
