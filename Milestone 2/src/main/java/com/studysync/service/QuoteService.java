package com.studysync.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class QuoteService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getQuote() {
        try {
            String url = "https://api.quotable.io/random";
            Map response = restTemplate.getForObject(url, Map.class);

            if (response == null) {
                return "Stay focused and keep going.";
            }

            return response.get("content") + " — " + response.get("author");
        } catch (Exception e) {
            return "Stay focused and keep going.";
        }
    }
}