package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.products.ProductVariant;
import edu.proptit.vieshop.service.ProductVariantService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/variants")
public class ProductVariantController {
    private final ProductVariantService productVariantService;

    @GetMapping("/of-product/{productId}")
    public CustomResponse<?> getProductVariant(@PathVariable Long productId) {
        return new CustomResponse<>().data(productVariantService.findByProductId(productId));
    }

    @PostMapping("")
    public CustomResponse<?> addProductVariant(@RequestBody ProductVariant productVariant) {
        return new CustomResponse<>().data(productVariantService.save(productVariant));
    }

    @PutMapping("/{id}")
    public CustomResponse<?> deleteProductVariant(@PathVariable Long id, @RequestBody ProductVariant productVariant) {
        return new CustomResponse<>().message(productVariantService.updateProductVariant(id, productVariant));
    }

    @DeleteMapping("/{id}")
    public CustomResponse<?> deleteProductVariant(@PathVariable Long id) {
        return new CustomResponse<>().message(productVariantService.deleteProductVariant(id));
    }
}
