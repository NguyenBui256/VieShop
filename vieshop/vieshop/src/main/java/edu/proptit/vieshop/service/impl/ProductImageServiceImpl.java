package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ProductImageRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.products.ProductImage;
import edu.proptit.vieshop.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {
    private final ProductImageRepository productImageRepository;
    @Override
    public List<ProductImage> findByProductId(Long productId) {
        return productImageRepository.findProductImageByProductId(productId);
    }

    @Override
    public ProductImage createProductImage(ProductImage productImage) {
        return productImageRepository.save(productImage);
    }

    @Override
    public String updateProductImage(Long id, ProductImage productImage) {
        ProductImage prodInDb = productImageRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Product Image Not Found"));
        prodInDb.setUpdatedAt(LocalDateTime.now());
        prodInDb.setImageUrl(productImage.getImageUrl());
        prodInDb.setIsThumbnail(productImage.getIsThumbnail());
        prodInDb.setDisplayOrder(productImage.getDisplayOrder());
        productImageRepository.save(prodInDb);
        return "Success";
    }

    @Override
    public String deleteProductImage(Long id) {
        ProductImage productImage = productImageRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Product Image Not Found"));
        productImage.setIsDelete(true);
        productImageRepository.save(productImage);
        return "Success";
    }
}
