package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.CommentDTO;
import edu.proptit.vieshop.model.products.Category;
import edu.proptit.vieshop.model.products.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> findByProductId(Long productId);
    Comment getCommentById(Long id);
    String createComment(CommentDTO commentDTO);
    String deleteComment(Long id);

}
