package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CommentDTO;
import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.service.CommentService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/comments")
public class CommentController {
    private final CommentService commentService;
    @GetMapping("/{productId}")
    public CustomResponse<?> getCommentsByProductId(@PathVariable("productId") Long productId) {
        return new CustomResponse<>().data(commentService.getCommentById(productId));
    }

    @PostMapping("")
    public CustomResponse<?> createComment(@RequestBody CommentDTO comment) {
        return new CustomResponse<>().message(commentService.createComment(comment));
    }

    @DeleteMapping("/{commentId}")
    public CustomResponse<?> deleteComment(@PathVariable("commentId") Long commentId) {
        return new CustomResponse<>().data(commentService.deleteComment(commentId));
    }
}
