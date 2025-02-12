package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.dto.ProductDTO;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.ProductsService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class ProductController {
    private final ProductsService productsService;

    public ProductController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping("/products")
    public CustomResponse<Page<Product>> findAll(
            @RequestParam(required = false, defaultValue = "20") Integer size,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "id") String sortBy) {
        return new CustomResponse<>("00", productsService.findAll(size, page, sortBy), "Danh sach san pham");
    }

    @GetMapping("/products/{id}")
    public CustomResponse<?> findById(@PathVariable Long id){
        return new CustomResponse<>().data(productsService.findById(id));
    }

    @GetMapping("/products/belong-to-shop/{id}")
    public CustomResponse<?> findByShopId(@PathVariable Long id){
        return new CustomResponse<>().data(productsService.findByShopId(id));
    }

    @PostMapping("/products")
    public CustomResponse<?> createProduct(@RequestBody @Valid ProductDTO product) {
        return new CustomResponse<>().data(productsService.createProduct(product));
    }

    @PutMapping("/products/{id}")
    public CustomResponse<?> updateProduct(@PathVariable Long id, @RequestBody @Valid ProductDTO product) {
        return new CustomResponse<>().message(productsService.updateProduct(id, product));
    }

    @DeleteMapping("/products/{id}")
    public CustomResponse<?> deleteProduct(@PathVariable Long id) {
        return new CustomResponse<>().message(productsService.deleteProduct(id));
    }
}
