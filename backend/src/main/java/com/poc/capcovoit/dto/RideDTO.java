package com.poc.capcovoit.dto;

import java.time.LocalDateTime;

public class RideDTO {
    public int id;
    public String start;
    public String end;
    public LocalDateTime date;
    public int seats;

    public DriverDTO driver;

    public boolean isDriver;
    public boolean joined;
}