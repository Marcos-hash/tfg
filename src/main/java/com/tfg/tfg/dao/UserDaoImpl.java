package com.tfg.tfg.dao;

import com.tfg.tfg.models.Comment;
import com.tfg.tfg.models.Hoop;
import com.tfg.tfg.models.Match;
import com.tfg.tfg.models.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository//Work with Repositories
@Transactional
public class UserDaoImpl implements UserDao{

    @PersistenceContext
    EntityManager entityManager;//conection with the DB
    @Override
    @Transactional
    public List<User> getUsers() {
        //trabajamos con los objetos de la clase, no de la tabla de DB
        String query = "FROM User";
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public void delete(Long id) {
        User user = entityManager.find(User.class, id);
        entityManager.remove(user);
    }

    @Override
    public void register(User user) {
        entityManager.merge(user);
    }

    @Override
    @Transactional
    public Boolean login(User user) {
        //trabajamos con los objetos de la clase, no de la tabla de DB
        String query = "FROM User where nickname= :nickname AND password = :password";
        List<User> lista = entityManager.createQuery(query)
                .setParameter("nickname", user.getNickname())
                .setParameter("password", user.getPassword())
                .getResultList();

        return !lista.isEmpty();
    }

    @Override
    public User find(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public User getUserByCredentials(String nickname, String password) {
        String query = "FROM User where nickname= :nickname AND password = :password";
        List<User> users = entityManager.createQuery(query, User.class)
                .setParameter("nickname", nickname)
                .setParameter("password", password)
                .getResultList();

        return users.isEmpty() ? null : users.get(0);
    }


    @Override
    @Transactional
    public List<Hoop> getHoops() {
        //trabajamos con los objetos de la clase, no de la tabla de DB
        String query = "FROM Hoop";
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public Hoop findHoop(Long id) {
        return entityManager.find(Hoop.class, id);
    }

    @Override
    public void update(User user) {
        entityManager.merge(user);
    }

    // UserDaoImpl.java
    @Override
    public void addFavouriteHoop(Long userId, Long hoopId) {
        User user = entityManager.find(User.class, userId);
        Hoop hoop = entityManager.find(Hoop.class, hoopId);
        user.getFavouriteHoops().add(hoop);
        entityManager.merge(user);
    }

    @Override
    public Set<Hoop> getFavourites(Long userId) {
        User user = entityManager.find(User.class, userId);
        return user.getFavouriteHoops();
    }

    @Override
    public void removeFromFavourite(Long userId, Long hoopId) {
        User user = entityManager.find(User.class, userId);
        Hoop hoop = entityManager.find(Hoop.class, hoopId);
        user.getFavouriteHoops().remove(hoop);
        entityManager.merge(user);
    }

    @Override
    @Transactional
    public List<Match> getMatches() {
        //trabajamos con los objetos de la clase, no de la tabla de DB
        String query = "FROM Match";
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public Match findMatch(Long id) {
        return entityManager.find(Match.class, id);
    }

    @Override
    public void createMatch(Match match) {
        entityManager.merge(match);
    }

    // Método para inscribir un usuario a un partido
    @Override
    public void signUpUserToMatch(Long userId, Long matchId) {
        User user = entityManager.find(User.class, userId);
        Match match = entityManager.find(Match.class, matchId);

        // Añadir el partido al usuario y viceversa
        user.getMatches().add(match);
        match.getPlayers().add(user);

        // Persistir los cambios
        entityManager.merge(user);
        entityManager.merge(match);
    }

    @Override
    public Set<User> getUsersFromMatch(Long matchId) {
        Match match = entityManager.find(Match.class, matchId);
        return match.getPlayers();
    }

    @Override
    public Set<Match> getMatchesFromUser(Long userId) {
        User user = entityManager.find(User.class, userId);
        return user.getMatches();
    }

    @Override
    public void signOutFromMatch(Long userId, Long matchId) {
        User user = entityManager.find(User.class, userId);
        Match match = entityManager.find(Match.class, matchId);
        user.getMatches().remove(match);
        entityManager.merge(user);
    }

    @Override
    @Transactional
    public List<Match> getMatchesFromHoop(Long hoopId) {
        // Utilizando parámetros en la consulta para evitar SQL injection
        String query = "SELECT m FROM Match m WHERE m.hoopid = :hoopId";
        return entityManager.createQuery(query, Match.class)
                .setParameter("hoopId", hoopId)
                .getResultList();
    }

    @Override
    public List<Match> getMatchesFilterByName(String name) {
        // Utilizando parámetros en la consulta para evitar SQL injection
        String query = "SELECT m FROM Match m WHERE m.name = :name";
        return entityManager.createQuery(query, Match.class)
                .setParameter("name", name)
                .getResultList();
    }

    @Override
    public List<Match> getMatchesFilterByDate(String date) {
        // Utilizando parámetros en la consulta para evitar SQL injection
        String query = "FROM Match";
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public List<Match> getMatchesFilterByFormat(String format) {
        // Utilizando parámetros en la consulta para evitar SQL injection
        String query = "SELECT m FROM Match m WHERE m.format = :format";
        return entityManager.createQuery(query, Match.class)
                .setParameter("format", format)
                .getResultList();
    }

    @Override
    public void removeUserFromMatch(Long userId, Long matchId) {
        User user = entityManager.find(User.class, userId);
        Match match = entityManager.find(Match.class, matchId);

        // Añadir el partido al usuario y viceversa
        user.getMatches().remove(match);
        match.getPlayers().remove(user);

        // Persistir los cambios
        entityManager.merge(user);
        entityManager.merge(match);
    }

    @Override
    public Set<Comment> getUserComments(Long userId) {
        User user = entityManager.find(User.class, userId);
        return user.getUsercomments();
    }

    @Override
    public Set<Comment> getHoopComments(Long hoopId) {
        Hoop hoop = entityManager.find(Hoop.class, hoopId);
        return hoop.getHoopcomments();
    }

    @Override
    public void addHoopComment(Long commentId, Long hoopId) {
        Hoop hoop = entityManager.find(Hoop.class, hoopId);
        Comment comment = entityManager.find(Comment.class, commentId);
        hoop.getHoopcomments().add(comment);
        entityManager.merge(hoop);
    }

    @Override
    public List<Comment> getComments() {
        //trabajamos con los objetos de la clase, no de la tabla de DB
        String query = "FROM Comment";
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public Comment findComment(Long id) {
        return entityManager.find(Comment.class, id);
    }

    @Override
    public void createComment(Comment comment) {
        entityManager.merge(comment);
    }

    @Override
    public void addUserComment(Long commentId, Long userId) {
        User user = entityManager.find(User.class, userId);
        Comment comment = entityManager.find(Comment.class, commentId);
        user.getUsercomments().add(comment);
        entityManager.merge(user);
    }

    @Override
    public void finishedMatch(Long matchId) {
        Match match = entityManager.find(Match.class, matchId);
        match.setFinished(true);
        entityManager.merge(match);
    }

    @Override
    public void commentedMatch(Long matchId) {
        Match match = entityManager.find(Match.class, matchId);
        match.setCommented(true);
        entityManager.merge(match);
    }


}
