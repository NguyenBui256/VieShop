package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.ChatMessageDTO;
import edu.proptit.vieshop.model.chats.Message;

import java.util.List;

public interface ChatMessageService {
    List<Message> findByChatRoomId(Long id);
    String saveMessage(ChatMessageDTO messageDTO);
    String deleteMessage(Long id);
    void sendMessage(ChatMessageDTO messageDTO);
}
