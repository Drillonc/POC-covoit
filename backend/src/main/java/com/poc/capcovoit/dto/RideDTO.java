package com.poc.capcovoit.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RideDTO {
    public int id;
    public String start;
    public String end;
    public LocalDateTime date;
    public int seats;

    public UserDTO driver;

    public boolean isDriver;
    public boolean joined;

    public List<UserDTO> passengers;
}