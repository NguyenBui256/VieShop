package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.ShopDTO;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ShopService {
    Page<Shop> findAll(int size, int page, String sortBy);
    Shop findById(Long id);
    List<Shop> findByUserId(Long id);
    Shop createShop(ShopDTO shop);
    String updateShop(Long id, ShopDTO shop);
    String deleteShop(Long id);
}
