package com.bit_project.bitmapweb.repository;

import com.bit_project.bitmapweb.entity.ExportedMessages;
import com.bit_project.bitmapweb.entity.InsertedMessages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExportedMessagesRepository extends JpaRepository<ExportedMessages, Long> {
    List<ExportedMessages> findAllByUserId(Long imageId);
}
