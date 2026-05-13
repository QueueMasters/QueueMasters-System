package com.queuemaster.backend.Controllers;

import com.queuemaster.backend.Repositories.SaleRepository;
import com.queuemaster.backend.Repositories.VehicleRepository;
import com.queuemaster.backend.Services.SaleRecord;
import com.queuemaster.backend.Services.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private VehicleRepository repository;

    @Autowired
    private SaleRepository saleRepository;

    @GetMapping
    public List<Vehicle> getBookings() {
        return repository.findAll();
    }

    @PostMapping
    public Vehicle addBooking(@RequestBody Vehicle vehicle) {
        vehicle.setStatus("In Queue");
        vehicle.setPaid(true);
        String safeWashType = vehicle.getWashType() != null ? vehicle.getWashType().toLowerCase() : "";
        if (safeWashType.contains("valet")) {
            vehicle.setAmountPaid(350.0);
        } else if (safeWashType.contains("engine")) {
            vehicle.setAmountPaid(150.0);
        } else {
            vehicle.setAmountPaid(100.0);
        }
        return repository.save(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle updatedVehicle) {
        return repository.findById(id)
                .map(vehicle -> {
                    vehicle.setPlateNumber(updatedVehicle.getPlateNumber());
                    vehicle.setCarModel(updatedVehicle.getCarModel());
                    vehicle.setPhoneNumber(updatedVehicle.getPhoneNumber());
                    return repository.save(vehicle);
                })
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    @PutMapping("/{id}/next")
    public Vehicle moveToNextStatus(@PathVariable Long id) {
        Vehicle vehicle = repository.findById(id).orElseThrow();
        String current = vehicle.getStatus();
        if (current.equals("In Queue")) {
            vehicle.setStatus("Washing");
        } else if (current.equals("Washing")) {
            vehicle.setStatus("Ready");
        }
        return repository.save(vehicle);
    }

    @DeleteMapping("/{id}/complete")
    public void completeWash(@PathVariable Long id) {
        Vehicle vehicle = repository.findById(id).orElseThrow();
        SaleRecord sale = new SaleRecord();
        sale.setPlateNumber(vehicle.getPlateNumber());
        sale.setWashType(vehicle.getWashType());
        sale.setDate(LocalDate.now());
        sale.setAmount(vehicle.getAmountPaid());
        saleRepository.save(sale);
        repository.delete(vehicle);
    }

    @GetMapping("/daily-total")
    public double getDailyTotal() {
        return saleRepository.findByDate(LocalDate.now())
                .stream()
                .mapToDouble(SaleRecord::getAmount)
                .sum();
    }

    @GetMapping("/all-sales")
    public List<SaleRecord> getAllSales() {
        return saleRepository.findAll();
    }

    @DeleteMapping("/clear-archive")
    public void clearEntireArchive() {
        saleRepository.deleteAll();
    }
}