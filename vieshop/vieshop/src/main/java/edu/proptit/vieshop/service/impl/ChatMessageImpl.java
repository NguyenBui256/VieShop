package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ChatMessageRepository;
import edu.proptit.vieshop.dto.ChatMessageDTO;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.chats.ChatMessage;
import edu.proptit.vieshop.model.chats.Message;
import edu.proptit.vieshop.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageImpl implements ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public List<Message> findMessageBetween(Long userId, Long receiverId) {
        return chatMessageRepository.findAllByUserId(userId, receiverId);
    }

    @Override
    public List<Message> findUserContact(Long userId) {
        return chatMessageRepository.findContactOfUser(userId);
    }

    @Override
    public Message saveMessage(ChatMessage chatMessage) {
        Message message = new Message();
        message.setSenderId(Long.parseLong(chatMessage.getSenderId()));
        message.setReceiverId(Long.parseLong(chatMessage.getReceiverId()));
        message.setReceiverName(chatMessage.getReceiverName());
        message.setReceiverType(chatMessage.getReceiverType().toString());
        message.setMessageType(chatMessage.getMessageType().toString());
        message.setContent(chatMessage.getContent());
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        message.setIsDelete(false);
        chatMessageRepository.save(message);
        return message;
    }

    @Override
    public String deleteMessage(Long id) {
        Message message = chatMessageRepository.findById(id)
                .orElseThrow( () -> new CustomException(HttpStatus.NOT_FOUND, String.format("MSG %d not found", id)));
        message.setIsDelete(true);
        chatMessageRepository.save(message);
        return "OK";
    }

    @Override
    @Async
    public void sendMessage(ChatMessageDTO messageDTO) {
    }
}
