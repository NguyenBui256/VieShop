package edu.proptit.vieshop.kafka;

import edu.proptit.vieshop.dto.ChatMessageDTO;
import org.springframework.kafka.support.converter.JsonMessageConverter;
import org.springframework.kafka.support.mapping.DefaultJackson2JavaTypeMapper;
import org.springframework.kafka.support.mapping.Jackson2JavaTypeMapper;

import java.util.Collections;

public class CustomMessageConverter extends JsonMessageConverter {
    public CustomMessageConverter() {
        super();
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
        typeMapper.setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID);
        typeMapper.addTrustedPackages("edu.proptit.vieshop");
        typeMapper.setIdClassMapping(Collections.singletonMap("message", ChatMessageDTO.class));
        this.setTypeMapper(typeMapper);
    }
}
