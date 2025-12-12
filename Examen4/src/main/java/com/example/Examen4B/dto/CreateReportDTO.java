package com.example.Examen4B.dto;

public class CreateReportDTO {
    private String productName;
    private String problemDescription;
    private String reportDate; // TIPO STRING

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }

    public String getReportDate() { return reportDate; }
    public void setReportDate(String reportDate) { this.reportDate = reportDate; }
}