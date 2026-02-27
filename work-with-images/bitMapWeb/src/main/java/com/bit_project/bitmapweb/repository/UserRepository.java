package com.bit_project.bitmapweb.repository;

import com.bit_project.bitmapweb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByLoginAndPass(String login, String pass);

}
