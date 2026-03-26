package com.poc.capcovoit.dto;

import java.time.LocalDateTime;
import java.util.List;

/*
 * Nom de classe : RideDTO
 *
 * Description   : Cette classe représente un trajet dans le système.
 *
 */
public class RideDTO {
    public int id;
    public String start;
    public String end;
    public LocalDateTime date;
    public int seats;

    public UserDTO driver;

    public boolean isDriver;
    public boolean joined;
    public boolean isPassed;

    public List<UserDTO> passengers;
}