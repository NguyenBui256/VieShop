package edu.proptit.vieshop.model.products;

import edu.proptit.vieshop.dto.ProductDTO;
import edu.proptit.vieshop.model.users.Shop;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany
    @JoinColumn(name = "product_id", nullable = false)
    private List<ProductImage> productImageList;

    @OneToMany
    @JoinColumn(name = "product_id", nullable = false)
    private List<ProductVariant> productVariants;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "rating", columnDefinition = "default 0")
    private Float rating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "total_sales")
    private Integer totalSales;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "is_delete", nullable = false)
    private Boolean isDelete;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

