package edu.proptit.vieshop.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
