package edu.proptit.vieshop.model.orders;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Orders")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @OneToMany
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems;

    @Column(name = "address_id", nullable = false)
    private Long addressId;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "shipping_method", nullable = false)
    private String shippingMethod;

    @Column(name = "shipping_fee", nullable = false)
    private Double shippingFee;

    @Column(name = "is_delete", nullable = false)
    private Boolean isDelete = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}

