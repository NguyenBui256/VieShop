package edu.proptit.vieshop.dto;

import edu.proptit.vieshop.model.users.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShopDTO {
    Long userId;
    private String name;
    private String description;
    private String avatarUrl;
    private String bannerUrl;
    private String address;
    private String phone;
    private Float rating;
}
