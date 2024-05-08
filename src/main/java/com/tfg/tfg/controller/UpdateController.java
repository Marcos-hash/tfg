package com.tfg.tfg.controller;

import com.tfg.tfg.dao.UserDao;
import com.tfg.tfg.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public void updateUser(@RequestBody User user){
        //RequestBody para convertir un json en un User object
        userDao.update(user);
    }


}
