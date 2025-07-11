package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "studentreg")
public class StudentRegistration {
    @Id
    private String id;

    // Room Info
    private String roomNo;
    private String fees;
    private String foodStatus;
    private String stayFrom;
    private String duration;

    // Personal Info
    private String course;
    private String regNo;
    private String name;
    private String gender;
    private String contact;

    @Indexed(unique = true) // Ensure email is unique at database level
    private String email;

    private String emergencyContact;
    private String guardianName;
    private String guardianRelation;
    private String guardianContact;

    // Correspondence Address
    private String corrAddress;
    private String corrCity;
    private String corrState;
    private String corrPincode;

    // Permanent Address
    private boolean permSame;
    private String permAddress;
    private String permCity;
    private String permState;
    private String permPincode;
    private String status = "PENDING";

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomNo() {
        return roomNo;
    }

    public void setRoomNo(String roomNo) {
        this.roomNo = roomNo;
    }

    public String getFees() {
        return fees;
    }

    public void setFees(String fees) {
        this.fees = fees;
    }

    public String getFoodStatus() {
        return foodStatus;
    }

    public void setFoodStatus(String foodStatus) {
        this.foodStatus = foodStatus;
    }

    public String getStayFrom() {
        return stayFrom;
    }

    public void setStayFrom(String stayFrom) {
        this.stayFrom = stayFrom;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getRegNo() {
        return regNo;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianRelation() {
        return guardianRelation;
    }

    public void setGuardianRelation(String guardianRelation) {
        this.guardianRelation = guardianRelation;
    }

    public String getGuardianContact() {
        return guardianContact;
    }

    public void setGuardianContact(String guardianContact) {
        this.guardianContact = guardianContact;
    }

    public String getCorrAddress() {
        return corrAddress;
    }

    public void setCorrAddress(String corrAddress) {
        this.corrAddress = corrAddress;
    }

    public String getCorrCity() {
        return corrCity;
    }

    public void setCorrCity(String corrCity) {
        this.corrCity = corrCity;
    }

    public String getCorrState() {
        return corrState;
    }

    public void setCorrState(String corrState) {
        this.corrState = corrState;
    }

    public String getCorrPincode() {
        return corrPincode;
    }

    public void setCorrPincode(String corrPincode) {
        this.corrPincode = corrPincode;
    }

    public boolean isPermSame() {
        return permSame;
    }

    public void setPermSame(boolean permSame) {
        this.permSame = permSame;
    }

    public String getPermAddress() {
        return permAddress;
    }

    public void setPermAddress(String permAddress) {
        this.permAddress = permAddress;
    }

    public String getPermCity() {
        return permCity;
    }

    public void setPermCity(String permCity) {
        this.permCity = permCity;
    }

    public String getPermState() {
        return permState;
    }

    public void setPermState(String permState) {
        this.permState = permState;
    }

    public String getPermPincode() {
        return permPincode;
    }

    public void setPermPincode(String permPincode) {
        this.permPincode = permPincode;
    }
}