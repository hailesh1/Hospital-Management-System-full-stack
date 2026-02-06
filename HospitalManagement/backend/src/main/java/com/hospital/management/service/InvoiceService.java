package com.hospital.management.service;

import com.hospital.management.dto.request.InvoiceRequest;
import com.hospital.management.dto.response.InvoiceResponse;
import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.InvoiceItem;
import com.hospital.management.entity.Patient;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.InvoiceRepository;
import com.hospital.management.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAll() {
        return invoiceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getById(String id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
        return toResponse(invoice);
    }

    @Transactional
    public InvoiceResponse create(InvoiceRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        Invoice invoice = new Invoice();
        invoice.setPatient(patient);
        invoice.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        invoice.setDate(request.getDate() != null ? request.getDate() : java.time.LocalDate.now());
        invoice.setDueDate(request.getDueDate());
        invoice.setTax(request.getTax());
        invoice.setPaymentMethod(request.getPaymentMethod());

        double subtotal = request.getItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();

        invoice.setSubtotal(subtotal);
        invoice.setTotal(subtotal + request.getTax());

        List<InvoiceItem> items = request.getItems().stream()
                .map(itemDto -> {
                    InvoiceItem item = new InvoiceItem();
                    item.setDescription(itemDto.getDescription());
                    item.setQuantity(itemDto.getQuantity());
                    item.setUnitPrice(itemDto.getUnitPrice());
                    item.setTotal(itemDto.getQuantity() * itemDto.getUnitPrice());
                    item.setInvoice(invoice);
                    return item;
                })
                .collect(Collectors.toList());

        invoice.setItems(items);
        return toResponse(invoiceRepository.save(invoice));
    }

    @Transactional
    public InvoiceResponse updateStatus(String id, Invoice.InvoiceStatus status) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
        
        invoice.setStatus(status);
        if (status == Invoice.InvoiceStatus.PAID) {
            invoice.setPaidDate(java.time.LocalDate.now());
        }
        invoice.setUpdatedAt(LocalDateTime.now());
        
        return toResponse(invoiceRepository.save(invoice));
    }

    @Transactional
    public void delete(String id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Invoice not found: " + id);
        }
        invoiceRepository.deleteById(id);
    }

    private InvoiceResponse toResponse(Invoice inv) {
        InvoiceResponse res = new InvoiceResponse();
        res.setId(inv.getId());
        res.setPatientId(inv.getPatient().getId());
        res.setPatientName(inv.getPatientName());
        res.setDate(inv.getDate());
        res.setDueDate(inv.getDueDate());
        res.setItems(inv.getItems().stream().map(item -> {
            InvoiceResponse.InvoiceItemDto dto = new InvoiceResponse.InvoiceItemDto();
            dto.setId(item.getId());
            dto.setDescription(item.getDescription());
            dto.setQuantity(item.getQuantity());
            dto.setUnitPrice(item.getUnitPrice());
            dto.setTotal(item.getTotal());
            return dto;
        }).collect(Collectors.toList()));
        res.setSubtotal(inv.getSubtotal());
        res.setTax(inv.getTax());
        res.setTotal(inv.getTotal());
        res.setStatus(inv.getStatus());
        res.setPaymentMethod(inv.getPaymentMethod());
        res.setPaidDate(inv.getPaidDate());
        res.setCreatedAt(inv.getCreatedAt());
        res.setUpdatedAt(inv.getUpdatedAt());
        return res;
    }
}



