package edu.proptit.vieshop.dto;

import edu.proptit.vieshop.model.products.Comment;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.users.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CommentDTO {
    private Long userId;
    private Long productId;
    private String content;
    private Long parentCommentId;
    private LocalDateTime createdAt;
}
