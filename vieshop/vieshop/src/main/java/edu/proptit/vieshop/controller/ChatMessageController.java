package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    @GetMapping("/user/{userId}")
    public CustomResponse<?> getAll(@PathVariable Long userId) {
        return new CustomResponse<>().data(chatMessageService.findAllByUserId(userId));
    }

    @DeleteMapping("/{messageId}")
    public CustomResponse<?> deleteMessage(@PathVariable Long messageId) {
         return new CustomResponse<>().message(chatMessageService.deleteMessage(messageId));
    }
}
