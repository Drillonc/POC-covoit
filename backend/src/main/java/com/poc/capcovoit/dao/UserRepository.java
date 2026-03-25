package com.poc.capcovoit.dao;

import com.poc.capcovoit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/*
 * Nom de classe : UserRepository
 *
 * Description   : Ce repository gère les opérations CRUD sur les utilisateurs.
 *
 */
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}
