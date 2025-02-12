package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.users.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAddressesRepository extends JpaRepository<UserAddress, Long> {
    @Query(value = "SELECT * FROM user_addresses u where u.user_id = :userId", nativeQuery = true)
    List<UserAddress> findUserAddressByUser(@Param("userId") Long userId);
}
