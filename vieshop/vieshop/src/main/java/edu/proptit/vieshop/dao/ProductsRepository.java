package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductsRepository extends JpaRepository<Product,Long> {
    @Query(value = "SELECT * FROM products p where p.shop_id = :shopId and p.is_delete = 0", nativeQuery = true)
    List<Product> findByShopId(@Param("shopId") Long shopId);
}
