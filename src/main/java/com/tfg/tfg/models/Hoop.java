package com.tfg.tfg.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Entity//para indicar que soy una entidad que trabja con la DB
@Table(name = "hoops")//para trabajar en esa DB
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "hoopcomments"})
public class Hoop {

    @Id
    @Setter @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Setter @Column(name = "name")
    private String name;
    @Setter @Column(name = "location")
    private String location;
    @Setter @Column(name = "state")
    private String state;
    @Setter @Column(name = "light")
    private String light;

    @Setter
    @ManyToMany(mappedBy = "favouriteHoops")
    private Set<User> users;

    @Setter
    @ManyToMany
    @JoinTable(
            name = "hoop_comments", // Nombre de la tabla de unión
            joinColumns = @JoinColumn(name = "hoop-c_id"), // Columna que enlaza a Hoop
            inverseJoinColumns = @JoinColumn(name = "comment-c_id") // Columna que enlaza a Comment
    )
    private Set<Comment> hoopcomments = new HashSet<>();

}
