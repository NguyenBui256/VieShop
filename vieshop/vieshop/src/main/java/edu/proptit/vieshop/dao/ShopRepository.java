package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShopRepository extends JpaRepository<Shop,Long> {
    @Query(value = "SELECT * FROM shops s where s.user_id = :userId and s.is_delete = 0", nativeQuery = true)
    List<Shop> findByUserId(@Param("userId") Long userId);
}
