package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.products.ProductImage;
import java.util.List;

public interface ProductImageService {
    List<ProductImage> findByProductId(Long productId);
    ProductImage createProductImage(ProductImage productImage);
    String updateProductImage(Long id, ProductImage productImage);
    String deleteProductImage(Long id);
}
