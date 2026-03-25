package com.poc.capcovoit.entity;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

/*
 * Nom de classe : User
 *
 * Description   : Cette classe représente un utilisateur dans le système.
 *
 */
@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(name="email")
    private String email;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String lastName;

    @Column(name="pw")
    private String pw;

    @ManyToMany(mappedBy = "participants")
    private List<Ride> ridesJoined = new ArrayList<>();

    public User() {

    }

    public User(String email, String firstName, String lastName, String pw) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pw = pw;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPw() {
        return pw;
    }

    public void setPw(String pw) {
        this.pw = pw;
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", pw='" + pw + '\'' +
                '}';
    }
}
