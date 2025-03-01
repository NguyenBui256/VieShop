package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.products.ProductImage;
import edu.proptit.vieshop.service.ProductImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product-images")
@RequiredArgsConstructor
public class ProductImageController {
    private final ProductImageService productImageService;

    @GetMapping("/of-product/{productId}")
    public CustomResponse<?> getProductImage(@PathVariable Long productId) {
        return new CustomResponse<>().data(productImageService.findByProductId(productId));
    }

    @PostMapping("")
    public CustomResponse<?> addProductImage(@RequestBody @Valid ProductImage productImage) {
        return new CustomResponse<>().data(productImageService.createProductImage(productImage));
    }

    @PutMapping("/{id}")
    public CustomResponse<?> updateProductImage(@PathVariable Long id, @RequestBody @Valid ProductImage productImage) {
        return new CustomResponse<>().message(productImageService.updateProductImage(id, productImage));
    }

    @DeleteMapping("/{id}")
    public CustomResponse<?> deleteProductImage(@PathVariable Long id) {
        return new CustomResponse<>().data(productImageService.deleteProductImage(id));
    }
}
