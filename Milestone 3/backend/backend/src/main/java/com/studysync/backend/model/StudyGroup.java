package com.studysync.backend.model;

import java.util.List;

public class StudyGroup {
    private Long id;
    private String name;
    private String courseName;
    private List<User> members;
    private List<Task> groupTasks;

    public StudyGroup() {
    }

    public StudyGroup(Long id, String name, String courseName, List<User> members, List<Task> groupTasks) {
        this.id = id;
        this.name = name;
        this.courseName = courseName;
        this.members = members;
        this.groupTasks = groupTasks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public List<Task> getGroupTasks() {
        return groupTasks;
    }

    public void setGroupTasks(List<Task> groupTasks) {
        this.groupTasks = groupTasks;
    }
}