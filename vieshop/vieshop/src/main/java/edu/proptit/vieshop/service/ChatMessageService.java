package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.ChatMessageDTO;
import edu.proptit.vieshop.model.chats.ChatMessage;
import edu.proptit.vieshop.model.chats.Message;

import java.util.List;

public interface ChatMessageService {
    List<Message> findMessageBetween(Long userId, Long receiverId);
    List<Message> findUserContact(Long userId);
    Message saveMessage(ChatMessage chatMessage);
    String deleteMessage(Long id);
    void sendMessage(ChatMessageDTO messageDTO);
}
