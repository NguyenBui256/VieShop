package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.products.ProductImage;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.domain.Page;

public interface ProductImageService {
    Page<ProductImage> findAll(int size, int page, String sortBy);
    ProductImage findById(Long id);
    String createProductImage(ProductImage productImage);
    String updateProductImage(Long id, ProductImage productImage);
    String deleteProductImage(Long id);
}
