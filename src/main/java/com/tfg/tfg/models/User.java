package com.tfg.tfg.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Entity//para indicar que soy una entidad que trabja con la DB
@Table(name = "data")//para trabajar en esa DB
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "favouriteHoops", "matches", "usercomments"})
public class User {

    @Id
    @Setter @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Setter @Column(name = "nickname")
    private String nickname;
    @Setter @Column(name = "age")
    private Long age;
    @Setter @Column(name = "email")
    private String email;
    @Setter @Column(name = "password")
    private String password;

    @Setter @Column(name = "position")
    private String position;
    @Setter @Column(name = "level")
    private String level;
    @Setter @Column(name = "physical")
    private String physical;


    @Setter
    @ManyToMany
    @JoinTable(
            name = "userFavouritesHoops", // Nombre de la tabla de unión
            joinColumns = @JoinColumn(name = "user_id"), // Columna que enlaza a User
            inverseJoinColumns = @JoinColumn(name = "hoop_id") // Columna que enlaza a Hoop
    )
    private Set<Hoop> favouriteHoops;



    @Setter
    @ManyToMany
    @JoinTable(
            name = "user_comments", // Nombre de la tabla de unión
            joinColumns = @JoinColumn(name = "user_id"), // Columna que enlaza a User
            inverseJoinColumns = @JoinColumn(name = "comment_id") // Columna que enlaza a Comment
    )
    private Set<Comment> usercomments = new HashSet<>();

    @Setter
    @ManyToMany
    @JoinTable(
            name = "user_matches", // name of the DB table
            joinColumns = @JoinColumn(name = "user_id"), // Column of the table that indicates the User
            inverseJoinColumns = @JoinColumn(name = "match_id") // Column of the table that indicates the Match
    )
    private Set<Match> matches = new HashSet<>();


    /*@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();*/
}
