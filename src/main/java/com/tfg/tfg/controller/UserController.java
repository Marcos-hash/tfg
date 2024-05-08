package com.tfg.tfg.controller;

import com.tfg.tfg.dao.UserDao;
import com.tfg.tfg.models.Comment;
import com.tfg.tfg.models.Hoop;
import com.tfg.tfg.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
public class UserController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/users")
    public List<User> getUsers(){

        return userDao.getUsers();
    }

    @RequestMapping(value = "/user/{id}", method = RequestMethod.DELETE)
    public void deleteUser(@PathVariable Long id){
        userDao.delete(id);
    }

    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
    public User getUser(@PathVariable Long id){
        return userDao.find(id);
    }

    @RequestMapping(value = "/user/{userId}/favourites/{hoopId}", method = RequestMethod.POST)
    public ResponseEntity<?> addFavourite(@PathVariable Long userId, @PathVariable Long hoopId) {
        userDao.addFavouriteHoop(userId, hoopId);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/user/{userId}/favourites", method = RequestMethod.GET)
    public ResponseEntity<Set<Hoop>> getFavourites(@PathVariable Long userId) {
        return ResponseEntity.ok(userDao.getFavourites(userId));
    }

    @RequestMapping(value = "/user/{userId}/favourites/{hoopId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> removeFromFavourite(@PathVariable Long userId, @PathVariable Long hoopId) {
        userDao.removeFromFavourite(userId, hoopId);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/user/{userId}/comments", method = RequestMethod.GET)
    public ResponseEntity<Set<Comment>> getUserComments(@PathVariable Long userId) {
        return ResponseEntity.ok(userDao.getUserComments(userId));
    }


}
