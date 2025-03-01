package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.ProductDTO;
import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.model.products.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();
    List<Category> findByShopId(Long shopId);
    Category findById(Long id);
    Category createCategory(Category category);
    String deleteCategory(Long id);
}
