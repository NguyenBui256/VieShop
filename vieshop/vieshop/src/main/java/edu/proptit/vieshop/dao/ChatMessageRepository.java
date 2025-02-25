package edu.proptit.vieshop.dao;

import edu.proptit.vieshop.model.chats.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<Message, Long> {
    @Query(value = "SELECT * from chat_messages c where c.sender_id = :userId and c.is_delete = false", nativeQuery = true)
    List<Message> findAllByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT * from chat_messages c where c.sender_id = :userId and c.is_delete = false", nativeQuery = true)
    List<Message> findContactOfUser(@Param("userId") Long userId);
}
