package com.tfg.tfg.dao;

import com.tfg.tfg.models.Comment;
import com.tfg.tfg.models.Hoop;
import com.tfg.tfg.models.Match;
import com.tfg.tfg.models.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Set;

public interface UserDao {

    List<User> getUsers();

    void delete(Long id);

    void register(User user);

    @Transactional
    Boolean login(User user);

    User find(Long id);

    //@Transactional
    User getUserByCredentials(String nickname, String password);


    @Transactional
    List<Hoop> getHoops();

    Hoop findHoop(Long id);

    void update(User user);

    void addFavouriteHoop(Long userId, Long hoopId);

    Set<Hoop> getFavourites(Long userId);

    void removeFromFavourite(Long userId, Long hoopId);

    List<Match> getMatches();

    Match findMatch(Long id);

    void createMatch(Match match);


    // Método para inscribir un usuario a un partido
    void signUpUserToMatch(Long userId, Long matchId);

    Set<User> getUsersFromMatch(Long matchId);

    Set<Match> getMatchesFromUser(Long userId);

    void signOutFromMatch(Long userId, Long matchId);

    List<Match> getMatchesFromHoop(Long hoopId);

    List<Match> getMatchesFilterByName(String name);

    List<Match> getMatchesFilterByDate(String date);

    List<Match> getMatchesFilterByFormat(String format);

    void removeUserFromMatch(Long userId, Long matchId);

    Set<Comment> getUserComments(Long userId);


    Set<Comment> getHoopComments(Long hoopId);

    void addHoopComment(Long commentId, Long hoopId);

    List<Comment> getComments();

    Comment findComment(Long id);

    void createComment(Comment comment);

    void addUserComment(Long commentId, Long userId);


    void finishedMatch(Long matchId);

    void commentedMatch(Long matchId);

}
