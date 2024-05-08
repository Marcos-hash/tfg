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
@Entity//to indicate that I am an entity that works with the DB
@Table(name = "matches")//to work on this DB table
public class Match {

    @Id
    @Setter @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Setter @Column(name = "name")
    private String name;
    @Setter @Column(name = "description")
    private String description;
    @Setter @Column(name = "date")
    private Date date;
    @Setter @Column(name = "hour")
    private String hour;
    @Setter @Column(name = "format")
    private String format;
    @Setter @Column(name = "nplayers")
    private Long nplayers;
    @Setter @Column(name = "hoopid")
    private Long hoopid;
    @Setter @Column(name = "organizerid")
    private Long organizerid;
    @Setter @Column(name = "finished")
    private Boolean finished=false;
    @Setter @Column(name = "commented")
    private Boolean commented=false;

    @ManyToMany(mappedBy = "matches")
    private Set<User> players = new HashSet<>();
}
