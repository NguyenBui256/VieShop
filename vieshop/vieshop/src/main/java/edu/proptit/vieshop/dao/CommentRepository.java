package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.orders.OrderItem;
import edu.proptit.vieshop.model.products.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query(value="SELECT * from comments c where c.product_id = :productId and c.is_delete = false", nativeQuery = true)
    List<Comment> findCommentsByProductId(@Param("{productId}") Long productId);
}
