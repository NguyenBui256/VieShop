package edu.proptit.vieshop.dto;

import edu.proptit.vieshop.model.products.ProductImage;
import edu.proptit.vieshop.model.products.ProductVariant;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductDTO {
    Long shopId;
    Long categoryId;
    String name;
    String description;
    BigDecimal basePrice;
    Integer stockQuantity;
    Float rating;
    List<ProductImage> productImageList;
    List<ProductVariant> productVariants;
}
