package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ReviewRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.products.Review;
import edu.proptit.vieshop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Override
    public Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new CustomException().notFound("Review"));
    }

    @Override
    public Page<Review> findByProductId(int size, int page, Long productId) {
        List<Review> reviewList = reviewRepository.findByProductId(productId);
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20));
        return new PageImpl<>(reviewList, pageable, reviewList.size());
    }

    @Override
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public String deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new CustomException().notFound("Review"));
        review.setIsDelete(true);
        reviewRepository.save(review);
        return "Success";
    }
}
