package edu.proptit.vieshop.model.users;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "Shops")
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "default \"\"")
    private String description;

    @Column(name = "avatar_url", columnDefinition = "default \"\"")
    private String avatarUrl;

    @Column(name = "banner_url", columnDefinition = "default \"\"")
    private String bannerUrl;

    @Column(name = "address", columnDefinition = "default \"\"")
    private String address;

    @Column(name = "phone", columnDefinition = "default \"\"")
    private String phone;

    @Column(name = "is_verified", nullable = false, columnDefinition = "default 0")
    private Boolean isVerified;

    @Column(name = "rating", nullable = false, columnDefinition = "default 0")
    private Float rating;

    @Column(name = "is_delete", nullable = false, columnDefinition = "default false")
    private Boolean isDelete;

    @Column(name = "created_at", updatable = false, columnDefinition = "default CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
}
