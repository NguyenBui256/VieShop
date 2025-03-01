package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.ProductDTO;
import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.model.products.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductsService {
    Page<Product> findAll(int size, int page, String sortBy);
    Product findById(Long id);
    List<Product> findByShopId(Long shopId);
    Product createProduct(ProductDTO product);
    String updateProduct(Long id, ProductDTO product);
    String deleteProduct(Long id);
}
