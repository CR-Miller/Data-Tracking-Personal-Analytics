package com.studysync.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String groupName;

    private String subject;

    public StudyGroup() {}

    public StudyGroup(String groupName, String subject) {
        this.groupName = groupName;
        this.subject = subject;
    }

    public Long getId() { return id; }

    public String getGroupName() { return groupName; }

    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getSubject() { return subject; }

    public void setSubject(String subject) { this.subject = subject; }
}