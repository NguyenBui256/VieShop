package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.products.Review;
import edu.proptit.vieshop.model.users.Shop;
import org.springframework.data.domain.Page;

public interface ReviewService {
    Page<Review> findAll(int size, int page, String sortBy);
    Review findById(Long id);
    String createReview(Review review);
    String updateReview(Long id, Review review);
    String deleteReview(Long id);
}
