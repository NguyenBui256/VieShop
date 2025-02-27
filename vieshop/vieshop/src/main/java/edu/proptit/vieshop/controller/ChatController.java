package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.common.NotificationStatus;
import edu.proptit.vieshop.dto.ChatMessageDTO;
import edu.proptit.vieshop.model.chats.ChatMessage;
import edu.proptit.vieshop.model.chats.Message;
import edu.proptit.vieshop.service.ChatMessageService;
import edu.proptit.vieshop.service.websocket.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        log.info(chatMessage.getSenderId());
        log.info(chatMessage.getContent());
        chatMessage.setCreatedAt(LocalDateTime.now().toString());
        chatMessageService.saveMessage(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId(), "/queue/messages",
                chatMessage
        );
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
