package com.poc.capcovoit.dao;

import com.poc.capcovoit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    // that's it ... no need to write any code LOL!

}
