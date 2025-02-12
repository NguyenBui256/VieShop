package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/category")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("")
    public CustomResponse<?> getAllCategories() {
        return new CustomResponse<>().data(categoryService.findAll());
    }

    @GetMapping("/belong-to-shop/{shopId}")
    public CustomResponse<?> getCategoryByShopId(@PathVariable Long shopId) {
        return new CustomResponse<>().data(categoryService.findByShopId(shopId));
    }

    @GetMapping("/{id}")
    public CustomResponse<?> getCategoryById(@PathVariable Long id) {
        return new CustomResponse<>().data(categoryService.findById(id));
    }

    @PostMapping("")
    public CustomResponse<?> addCategory(@RequestBody Category category) {
        return new CustomResponse<>().data(categoryService.createCategory(category));
    }

    @DeleteMapping("/{id}")
    public CustomResponse<?> deleteCategory(@PathVariable Long id) {
        return new CustomResponse<>().message(categoryService.deleteCategory(id));
    }
}
