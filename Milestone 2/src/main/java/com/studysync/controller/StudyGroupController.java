package com.studysync.controller;

import com.studysync.model.StudyGroup;
import com.studysync.repository.StudyGroupRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class StudyGroupController {

    private final StudyGroupRepository studyGroupRepository;

    public StudyGroupController(StudyGroupRepository studyGroupRepository) {
        this.studyGroupRepository = studyGroupRepository;
    }

    @GetMapping
    public List<StudyGroup> getAllGroups() {
        return studyGroupRepository.findAll();
    }

    @PostMapping
    public StudyGroup createGroup(@RequestBody StudyGroup group) {
        return studyGroupRepository.save(group);
    }
}