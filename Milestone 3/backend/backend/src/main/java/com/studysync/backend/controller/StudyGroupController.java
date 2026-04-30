package com.studysync.backend.controller;

import com.studysync.backend.model.StudyGroup;
import com.studysync.backend.service.StudyGroupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-groups")
@CrossOrigin(origins = "*")
public class StudyGroupController {

    private final StudyGroupService service;

    public StudyGroupController(StudyGroupService service) {
        this.service = service;
    }

    @GetMapping
    public List<StudyGroup> getAllStudyGroups() {
        return service.getAllStudyGroups();
    }

    @PostMapping
    public StudyGroup createStudyGroup(@RequestBody StudyGroup studyGroup) {
        return service.createStudyGroup(studyGroup);
    }
}