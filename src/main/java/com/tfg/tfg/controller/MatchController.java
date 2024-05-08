package com.tfg.tfg.controller;

import com.tfg.tfg.dao.UserDao;
import com.tfg.tfg.models.Hoop;
import com.tfg.tfg.models.Match;
import com.tfg.tfg.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class MatchController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "matches", method = RequestMethod.GET)
    public List<Match> getMatches(){
        return userDao.getMatches();
    }

    @RequestMapping(value = "/matches/{id}", method = RequestMethod.GET)
    public Match getMatch(@PathVariable Long id){
        return userDao.findMatch(id);
    }

    @RequestMapping(value = "/match", method = RequestMethod.POST)
    public void addMatch(@RequestBody Match match){
        userDao.createMatch(match);
    }

    @RequestMapping(value = "/matches/{matchId}/signup/{userId}", method = RequestMethod.POST)
    public ResponseEntity<?> signUpUserToMatch(@PathVariable Long userId, @PathVariable Long matchId) {
        try {
            userDao.signUpUserToMatch(userId, matchId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(value = "/matches/{matchId}/remove/{userId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> removeUserFromMatch(@PathVariable Long userId, @PathVariable Long matchId) {
        try {
            userDao.removeUserFromMatch(userId, matchId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(value = "/match/{matchId}/users", method = RequestMethod.GET)
    public ResponseEntity<Set<User>> getUsersFromMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(userDao.getUsersFromMatch(matchId));
    }

    @RequestMapping(value = "/user/{userId}/matches", method = RequestMethod.GET)
    public ResponseEntity<Set<Match>> getMatchesFromUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userDao.getMatchesFromUser(userId));
    }


    @RequestMapping(value = "/user/{userId}/matches/{matchId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> signOutFromMatch(@PathVariable Long userId, @PathVariable Long matchId) {
        userDao.signOutFromMatch(userId, matchId);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/matches/name/{name}", method = RequestMethod.GET)
    public ResponseEntity<List<Match>> getMatchesFilterByName(@PathVariable String name) {
        return ResponseEntity.ok(userDao.getMatchesFilterByName(name));
    }

    @RequestMapping(value = "/matches/date/{date}", method = RequestMethod.GET)
    public ResponseEntity<List<Match>> getMatchesFilterByDate(@PathVariable String date) {
        List<Match> allMatches = userDao.getMatches();

        // Formatear las fechas como cadenas
        List<Match> filteredMatches = allMatches.stream()
                .filter(match -> formatDateString(match.getDate()).equals(date))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filteredMatches);
    }

    // Función para formatear una fecha como cadena
    private String formatDateString(Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        return dateFormat.format(date);
    }

    @RequestMapping(value = "/matches/format/{format}", method = RequestMethod.GET)
    public ResponseEntity<List<Match>> getMatchesFilterByFormat(@PathVariable String format) {
        return ResponseEntity.ok(userDao.getMatchesFilterByFormat(format));
    }

    @RequestMapping(value = "/match/{matchId}/finished", method = RequestMethod.PUT)
    public void matchFinished(@PathVariable Long matchId){
        //RequestBody para convertir un json en un Match object
        userDao.finishedMatch(matchId);
    }

    @RequestMapping(value = "/match/{matchId}/commented", method = RequestMethod.PUT)
    public void matchCommented(@PathVariable Long matchId){
        //RequestBody para convertir un json en un Match object
        userDao.commentedMatch(matchId);
    }

}
