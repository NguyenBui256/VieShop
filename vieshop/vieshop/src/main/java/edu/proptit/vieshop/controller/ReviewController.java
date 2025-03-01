package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.products.Review;
import edu.proptit.vieshop.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/of-product/{productId}")
    public CustomResponse<?> getReviewOfProduct(
            @PathVariable Long productId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        return new CustomResponse<>().data(reviewService.findByProductId(size, page, productId));
    }

    @PostMapping("")
    public CustomResponse<?> createReview(@RequestBody @Valid Review review) {
        return new CustomResponse<>().data(reviewService.createReview(review));
    }

    @DeleteMapping("/{reviewId}")
    public CustomResponse<?> deleteReview(@PathVariable Long reviewId) {
        return new CustomResponse<>().data(reviewService.deleteReview(reviewId));
    }
}
