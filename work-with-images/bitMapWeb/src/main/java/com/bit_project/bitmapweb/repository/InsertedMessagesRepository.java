package com.bit_project.bitmapweb.repository;

import com.bit_project.bitmapweb.entity.InsertedMessages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsertedMessagesRepository extends JpaRepository<InsertedMessages, Long> {
    List<InsertedMessages> findAllByUserId(Long imageId);
}
