package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.products.ProductVariant;

import java.util.List;

public interface ProductVariantService {
    List<ProductVariant> findByProductId(Long shopId);
    ProductVariant save(ProductVariant productVariant);
    String updateProductVariant(Long id, ProductVariant productVariant);
    String deleteProductVariant(Long id);
}
