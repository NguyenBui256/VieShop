package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.dto.ProductDTO;
import edu.proptit.vieshop.dto.ShopDTO;
import edu.proptit.vieshop.model.users.Shop;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.ShopService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
public class ShopController {
    private final ShopService shopService;

    @GetMapping("/shops")
    public CustomResponse<?> findAll(
            @RequestParam(required = false, defaultValue = "20") Integer size,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "id") String sortBy) {
        return new CustomResponse<>().data(shopService.findAll(size, page, sortBy));
    }

    @GetMapping("/shops/owning-shop")
    public CustomResponse<?> findByUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User tokenUser = (User) authentication.getPrincipal();
        return new CustomResponse<>().data(shopService.findByUserId(tokenUser.getId()));
    }

    @GetMapping("/shops/{id}")
    public CustomResponse<?> findById(@PathVariable Long id) {
        return new CustomResponse<>().data(shopService.findById(id));
    }

    @PostMapping("/shops")
    public CustomResponse<?> createProduct(@RequestBody @Valid ShopDTO shop) {
        return new CustomResponse<>().data(shopService.createShop(shop));
    }

    @PutMapping("/shops/{id}")
    public CustomResponse<?> updateProduct(@PathVariable Long id, @RequestBody @Valid ShopDTO shop) {
        return new CustomResponse<>().message(shopService.updateShop(id, shop));
    }

    @DeleteMapping("/shops/{id}")
    public CustomResponse<?> deleteProduct(@PathVariable Long id) {
        return new CustomResponse<>().message(shopService.deleteShop(id));
    }


}
