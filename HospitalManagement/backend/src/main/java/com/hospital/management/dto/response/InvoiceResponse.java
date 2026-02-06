package com.hospital.management.dto.response;

import com.hospital.management.entity.Invoice;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class InvoiceResponse {
    private String id;
    private String patientId;
    private String patientName;
    private LocalDate date;
    private LocalDate dueDate;
    private List<InvoiceItemDto> items = new ArrayList<>();
    private Double subtotal;
    private Double tax;
    private Double total;
    private Invoice.InvoiceStatus status;
    private String paymentMethod;
    private LocalDate paidDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class InvoiceItemDto {
        private String id;
        private String description;
        private Integer quantity;
        private Double unitPrice;
        private Double total;
    }
}



