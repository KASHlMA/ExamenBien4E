package com.example.Examen4B.controller;

import com.example.Examen4B.dto.CreateReportDTO;
import com.example.Examen4B.model.Report;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final List<Report> reports = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody CreateReportDTO dto) {
        // Validar String productName
        if (dto.getProductName() == null || dto.getProductName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: campo obligatorio (productName)");
        }
        // Validar String problemDescription
        if (dto.getProblemDescription() == null || dto.getProblemDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: campo obligatorio (problemDescription)");
        }

        // Validar String reportDate (Que no esté vacío y cumpla formato ####-##-##)
        if (dto.getReportDate() == null || !dto.getReportDate().matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().body("Error: campo obligatorio o formato inválido");
        }

        // Guardar como String
        Report newReport = new Report(
                idCounter.getAndIncrement(),
                dto.getProductName(),
                dto.getProblemDescription(),
                dto.getReportDate()
        );

        reports.add(newReport);
        return ResponseEntity.status(HttpStatus.CREATED).body(newReport);
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchReports(@RequestParam(required = false) String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: campo obligatorio (name)");
        }

        List<Report> matches = reports.stream()
                .filter(r -> r.getProductName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());

        if (matches.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: product no encontrado");
        }

        return ResponseEntity.ok(matches);
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<?> resolveReport(@PathVariable Long id) {
        Optional<Report> reportOpt = reports.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst();

        if (reportOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: product no encontao");
        }

        Report report = reportOpt.get();
        report.setResolved(true);

        return ResponseEntity.ok(report);
    }
}