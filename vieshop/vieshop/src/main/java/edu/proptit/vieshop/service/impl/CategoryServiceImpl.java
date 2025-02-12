package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.CategoryRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.dto.ProductDTO;
import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Category> findByShopId(Long shopId) {
        return categoryRepository.findByShopId(shopId);
    }

    @Override
    public Category findById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    @Override
    public Category createCategory(Category category) {
        Optional<Category> categoryInDB = categoryRepository.findById(category.getId());
        if(categoryInDB.isPresent()) {
            throw new CustomException(HttpStatus.CONFLICT, "Category already exists");
        }
        categoryRepository.save(category);
        return category;
    }

    @Override
    public String deleteCategory(Long id) {
        Category categoryInDB = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Category not found"));
        categoryRepository.save(categoryInDB);
        return "Category deleted";
    }
}
