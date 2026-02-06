package com.hospital.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class InvoiceRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    private LocalDate date;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @Valid
    @NotNull(message = "Invoice items are required")
    private List<InvoiceItemDto> items = new ArrayList<>();

    @NotNull(message = "Tax is required")
    private Double tax;

    private String paymentMethod;

    @Data
    public static class InvoiceItemDto {
        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        private Double unitPrice;
    }
}



