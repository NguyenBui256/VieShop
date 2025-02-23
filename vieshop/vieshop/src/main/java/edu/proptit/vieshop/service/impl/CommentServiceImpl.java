package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.CommentRepository;
import edu.proptit.vieshop.dto.CommentDTO;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.products.Comment;
import edu.proptit.vieshop.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;

    @Override
    public List<Comment> findByProductId(Long productId) {
        return commentRepository.findCommentsByProductId(productId);
    }

    @Override
    public Comment getCommentById(Long id) {
        return commentRepository.findById(id).orElseThrow(
                () -> new CustomException(HttpStatus.NOT_FOUND, "Comment not found")
        );
    }

    @Override
    public String createComment(CommentDTO commentDTO) {
        Comment commentToDB = new Comment();
        commentToDB.setUserId(commentDTO.getUserId());
        commentToDB.setProductId(commentDTO.getProductId());
        commentToDB.setContent(commentDTO.getContent());
        commentToDB.setCreatedAt(commentDTO.getCreatedAt());
        commentToDB.setParentCommentId(commentToDB.getParentCommentId());
        commentRepository.save(commentToDB);
        return "OK";
    }

    @Override
    public String deleteComment(Long id) {
        Comment comment = commentRepository.findById(id).orElseThrow(
                () -> new CustomException(HttpStatus.NOT_FOUND, "Comment not found")
        );
        comment.setIsDelete(true);
        commentRepository.save(comment);
        return "OK";
    }
}
