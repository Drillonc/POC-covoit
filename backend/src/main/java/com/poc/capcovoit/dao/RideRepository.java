package com.poc.capcovoit.dao;

import com.poc.capcovoit.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/*
 * Nom de classe : RideRepository
 *
 * Description   : Ce repository gère les opérations CRUD sur les trajets.
 *
 */
public interface RideRepository extends JpaRepository<Ride, Integer> {
    List<Ride> findByDriverEmail(String driverEmail);

    
    @Query("SELECT r FROM Ride r JOIN r.participants p WHERE p.email = :email")
    List<Ride> findByParticipantEmail(String email);

}