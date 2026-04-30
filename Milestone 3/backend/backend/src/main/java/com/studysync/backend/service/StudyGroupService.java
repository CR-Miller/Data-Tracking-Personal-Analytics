package com.studysync.backend.service;

import com.studysync.backend.model.StudyGroup;
import com.studysync.backend.repository.StudyGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyGroupService {

    private final StudyGroupRepository repository;

    public StudyGroupService(StudyGroupRepository repository) {
        this.repository = repository;
    }

    public List<StudyGroup> getAllStudyGroups() {
        return repository.findAll();
    }

    public StudyGroup createStudyGroup(StudyGroup studyGroup) {
        return repository.save(studyGroup);
    }
}