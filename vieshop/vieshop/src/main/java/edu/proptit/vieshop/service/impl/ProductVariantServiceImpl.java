package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ProductVariantRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.products.ProductVariant;
import edu.proptit.vieshop.service.ProductVariantService;
import edu.proptit.vieshop.service.ProductsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {
    private final ProductVariantRepository productVariantRepository;

    @Override
    public List<ProductVariant> findByProductId(Long shopId) {
        return productVariantRepository.findByProductId(shopId);
    }

    @Override
    public ProductVariant save(ProductVariant productVariant) {
        Optional<ProductVariant> productVariantDB = productVariantRepository.findById(productVariant.getId());
        if(productVariantDB.isPresent()) {
            throw new CustomException(HttpStatus.CONFLICT, "Variant already exists.");
        }
        return productVariantRepository.save(productVariant);
    }

    @Override
    public String updateProductVariant(Long id, ProductVariant productVariant) {
        ProductVariant productVariantDB = productVariantRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Product variant not found"));
        productVariantDB.setName(productVariant.getName());
        productVariantDB.setPrice(productVariant.getPrice());
        productVariantDB.setQuantity(productVariant.getQuantity());
        productVariantRepository.save(productVariantDB);
        return "Product variant successfully updated";
    }


    @Override
    public String deleteProductVariant(Long id) {
        ProductVariant productVariant = productVariantRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Product variant not found"));
        productVariant.setIsDelete(true);
        productVariantRepository.save(productVariant);
        return "Product variant successfully deleted";
    }
}
