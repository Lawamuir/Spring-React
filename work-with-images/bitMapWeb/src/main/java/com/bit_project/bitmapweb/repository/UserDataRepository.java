package com.bit_project.bitmapweb.repository;

import com.bit_project.bitmapweb.entity.UserData;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDataRepository  extends JpaRepository<UserData, Long> {
    //Optional<UserData> findFirstByUserIdOrderByCreatedAtAsc(Long userId);
    UserData findFirstByUserId(Long userId);
    List<UserData> findAllByUserId(Long userId);

    @Transactional
    void deleteByImagePath(String path);

    UserData findByImagePath(String imagePath);
}
