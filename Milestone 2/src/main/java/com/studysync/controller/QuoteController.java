package com.studysync.controller;

import com.studysync.service.QuoteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quote")
@CrossOrigin(origins = "*")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping
    public String getQuote() {
        return quoteService.getQuote();
    }
}