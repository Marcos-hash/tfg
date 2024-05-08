package com.tfg.tfg.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Entity//para indicar que soy una entidad que trabja con la DB
@Table(name = "comments")//para trabajar en esa DB
public class Comment {

    @Id
    @Setter @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Setter @Column(name = "sender")
    private Long sender;
    @Setter @Column(name = "userid")
    private Long userid;
    @Setter @Column(name = "hoopid")
    private Long hoopid;
    @Setter @Column(name = "msg")
    private String msg;

    @ManyToMany(mappedBy = "usercomments")
    private Set<User> users = new HashSet<>();

    @ManyToMany(mappedBy = "hoopcomments")
    private Set<Hoop> hoops = new HashSet<>();
}
