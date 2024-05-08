package com.tfg.tfg.controller;

import com.tfg.tfg.dao.UserDao;
import com.tfg.tfg.models.Comment;
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
public class CommentController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/comments", method = RequestMethod.GET)
    public List<Comment> getComments(){
        return userDao.getComments();
    }

    @RequestMapping(value = "/comments/{id}", method = RequestMethod.GET)
    public Comment getComment(@PathVariable Long id){
        return userDao.findComment(id);
    }

    @RequestMapping(value = "/comment", method = RequestMethod.POST)
    public void addComment(@RequestBody Comment comment){
        //RequestBody para convertir un json en un Match object
        userDao.createComment(comment);
    }

    @RequestMapping(value = "/comment/{commentId}/toHoop/{hoopId}", method = RequestMethod.POST)
    public ResponseEntity<?> addHoopComment(@PathVariable Long commentId, @PathVariable Long hoopId) {
        userDao.addHoopComment(commentId, hoopId);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/comment/{commentId}/toUser/{userId}", method = RequestMethod.POST)
    public ResponseEntity<?> addUserComment(@PathVariable Long commentId, @PathVariable Long userId) {
        userDao.addUserComment(commentId, userId);
        return ResponseEntity.ok().build();
    }
}
