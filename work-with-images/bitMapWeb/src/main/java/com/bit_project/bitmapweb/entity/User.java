package com.bit_project.bitmapweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nickname")
    private String login;

    @Column(name = "password")
    private String pass;

    @Column(name = "mode")
    private Integer mode;

    @Column(name = "path")
    private String path;

    @Column(name = "updated_path")
    private String updatedPath;
}
