package com.tfg.tfg.controller;

import com.tfg.tfg.dao.UserDao;
import com.tfg.tfg.models.Comment;
import com.tfg.tfg.models.Hoop;
import com.tfg.tfg.models.Match;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
public class HoopsController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/hoops")
    public List<Hoop> getUsers(){

        return userDao.getHoops();
    }

    @RequestMapping(value = "/hoop/{id}", method = RequestMethod.GET)
    public Hoop getHoop(@PathVariable Long id){
        return userDao.findHoop(id);
    }

    @RequestMapping(value = "/hoop/{hoopId}/matches", method = RequestMethod.GET)
    public ResponseEntity<List<Match>> getMatchesFromHoop(@PathVariable Long hoopId) {
        return ResponseEntity.ok(userDao.getMatchesFromHoop(hoopId));
    }

    @RequestMapping(value = "/hoop/{hoopId}/comments", method = RequestMethod.GET)
    public ResponseEntity<Set<Comment>> getHoopComments(@PathVariable Long hoopId) {
        return ResponseEntity.ok(userDao.getHoopComments(hoopId));
    }

}
