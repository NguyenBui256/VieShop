package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ShopRepository;
import edu.proptit.vieshop.dao.UserRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.dto.ShopDTO;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.users.Shop;
import edu.proptit.vieshop.service.ShopService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ShopServiceImpl implements ShopService {
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    @Override
    public Page<Shop> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        List<Shop> list = shopRepository.findAll();
        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Shop findById(Long id) {
        Shop shopDB = shopRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Shop not found"));
        if(shopDB.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Shop not found");
        return shopDB;
    }

    @Override
    public List<Shop> findByUserId(Long id) {
        return shopRepository.findByUserId(id);
    }

    @Override
    public Shop createShop(ShopDTO shop) {
        Shop shopToDB = new Shop();
        shopToDB.setUser(userRepository.findById(shop.getUserId()).orElseThrow(()
                -> new CustomException(HttpStatus.NOT_FOUND, "User not found")
        ));
        shopToDB.setName(shop.getName());
        shopToDB.setDescription(shop.getDescription());
        shopToDB.setAvatarUrl(shop.getAvatarUrl());
        shopToDB.setBannerUrl(shop.getBannerUrl());
        shopToDB.setRating(shop.getRating());
        shopToDB.setPhone(shop.getPhone());
        shopToDB.setAddress(shop.getAddress());
        shopToDB.setIsDelete(false);
        shopRepository.save(shopToDB);
        return shopToDB;
    }

    @Override
    public String updateShop(Long id, ShopDTO shop) {
        Shop shopDB = shopRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Shop not found"));
        if(shopDB.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Shop not found");
        shopDB.setName(shop.getName());
        shopDB.setDescription(shop.getDescription());
        shopDB.setAvatarUrl(shop.getAvatarUrl());
        shopDB.setBannerUrl(shop.getBannerUrl());
        shopDB.setRating(shop.getRating());
        shopDB.setPhone(shop.getPhone());
        shopDB.setAddress(shop.getAddress());
        shopRepository.save(shopDB);
        return "Shop updated!";
    }

    @Override
    public String deleteShop(Long id) {
        Shop shopDB = shopRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Shop not found"));
        if(shopDB.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Shop not found");
        shopDB.setIsDelete(true);
        shopRepository.save(shopDB);
        return "Shop deleted";
    }
}
