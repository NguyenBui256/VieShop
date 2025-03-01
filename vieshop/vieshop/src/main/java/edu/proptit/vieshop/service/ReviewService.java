package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.products.Review;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.domain.Page;

public interface ReviewService {
    Review findById(Long id);
    Page<Review> findByProductId(int size, int page, Long productId);
    Review createReview(Review review);
    String deleteReview(Long id);
}
