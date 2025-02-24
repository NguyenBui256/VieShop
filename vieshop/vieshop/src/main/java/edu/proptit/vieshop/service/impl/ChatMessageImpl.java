package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ChatMessageRepository;
import edu.proptit.vieshop.dto.ChatMessageDTO;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.kafka.CustomMessageConverter;
import edu.proptit.vieshop.model.chats.Message;
import edu.proptit.vieshop.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageImpl implements ChatMessageService {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public List<Message> findAllByUserId(Long userId) {
        return chatMessageRepository.findAllByUserId(userId);
    }

    @Override
    public String saveMessage(ChatMessageDTO messageDTO) {
        Message message = new Message();
//        chatMessage.setChatRoomId(Long.parseLong(messageDTO.getChatRoomId()));
//        chatMessage.setSenderId(Long.parseLong(messageDTO.getSenderId()));
//        chatMessage.setMessageType(messageDTO.getMessageType().toString());
        message.setContent(messageDTO.getContent());
        message.setCreatedAt(LocalDateTime.now());
        message.setIsDelete(false);
        message.setIsRead(false);
        chatMessageRepository.save(message);
        return "OK";
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
        kafkaTemplate.send("message", messageDTO);
        kafkaTemplate.setMessageConverter(new CustomMessageConverter());
    }
}
