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
    public CustomResponse<?> getUserMessage(@PathVariable Long userId) {
        return new CustomResponse<>().data(chatMessageService.findUserContact(userId));
    }

    @GetMapping("/between")
    public CustomResponse<?> getMessageBetween(@RequestParam Long userId, @RequestParam Long receiverId) {
        return new CustomResponse<>().data(chatMessageService.findMessageBetween(userId, receiverId));
    }

    @DeleteMapping("/{messageId}")
    public CustomResponse<?> deleteMessage(@PathVariable Long messageId) {
         return new CustomResponse<>().message(chatMessageService.deleteMessage(messageId));
    }
}
