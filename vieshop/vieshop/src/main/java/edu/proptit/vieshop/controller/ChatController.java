package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.model.chats.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessageDTO) {
        System.out.println(chatMessageDTO.getContent());
        System.out.println(chatMessageDTO.getSenderName());
        messagingTemplate.convertAndSendToUser(chatMessageDTO.getReceiverId(),
                "/chat", chatMessageDTO);
        return chatMessageDTO;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        HashMap<String,Object> map = new HashMap<>();
        map.put("username", chatMessage.getSenderName());
        map.put("userId", chatMessage.getSenderId());
        headerAccessor.setSessionAttributes(map);
        return chatMessage;
    }
}
