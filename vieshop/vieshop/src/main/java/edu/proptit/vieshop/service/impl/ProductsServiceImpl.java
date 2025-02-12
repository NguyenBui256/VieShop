package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ProductsRepository;
import edu.proptit.vieshop.dao.ShopRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.dto.ProductDTO;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.users.Shop;
import edu.proptit.vieshop.service.ProductsService;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductsServiceImpl implements ProductsService {
    private final ProductsRepository productsRepository;
    private final ShopRepository shopRepository;

    public ProductsServiceImpl(ProductsRepository productsRepository, ShopRepository shopRepository) {
        this.productsRepository = productsRepository;
        this.shopRepository = shopRepository;
    }

    @Override
    public Page<Product> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        List<Product> list = productsRepository.findAll();
        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Product findById(Long id) {
        Product productDB = productsRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Product not found"));
        if(productDB.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Product not found");
        return productDB;
    }

    @Override
    public List<Product> findByShopId(Long shopId) {
        return productsRepository.findByShopId(shopId);
    }

    @Override
    public Product createProduct(ProductDTO product) {
        Product productToDB = new Product();
        Shop productShop = shopRepository.findById(product.getShopId()).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Shop not found"));
        if(productShop.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Shop not found");
        productToDB.setShop(productShop);
        productToDB.setName(product.getName());
        productToDB.setDescription(product.getDescription());
//        productToDB.setCategory(product.getCategoryId());
        productToDB.setStockQuantity(product.getStockQuantity());
        productToDB.setBasePrice(product.getBasePrice());
        productsRepository.save(productToDB);
        return productToDB;
    }

    @Override
    public String updateProduct(Long id, ProductDTO product) {
        Product productDB = productsRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Product not found"));
        if(productDB.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Product not found");
        productDB.setName(product.getName());
        productDB.setDescription(product.getDescription());
//        productToDB.setCategory(product.getCategoryId());
        productDB.setStockQuantity(product.getStockQuantity());
        productDB.setBasePrice(product.getBasePrice());
        productsRepository.save(productDB);
        return "Product updated!";
    }

    @Override
    public String deleteProduct(Long id) {
        Product productDB = productsRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Product not found"));
        if(productDB.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Product not found");
        productDB.setIsDelete(true);
        productsRepository.save(productDB);
        return "Product deleted";
    }
}
