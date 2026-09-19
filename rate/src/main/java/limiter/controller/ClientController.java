package limiter.controller;

import jakarta.validation.Valid;
import limiter.dto.BucketStateResponse;
import limiter.dto.ClientConfigurationRequest;
import limiter.dto.ClientConfigurationResponse;
import limiter.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ClientConfigurationResponse> createClient(
            @Valid @RequestBody ClientConfigurationRequest request) {
        ClientConfigurationResponse response = clientService.createClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ClientConfigurationResponse>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientConfigurationResponse> getClient(
            @PathVariable String clientId) {
        return ResponseEntity.ok(clientService.getClientByClientId(clientId));
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ClientConfigurationResponse> updateClient(
            @PathVariable String clientId,
            @Valid @RequestBody ClientConfigurationRequest request) {
        return ResponseEntity.ok(clientService.updateClient(clientId, request));
    }

    @PatchMapping("/{clientId}/deactivate")
    public ResponseEntity<ClientConfigurationResponse> deactivateClient(
            @PathVariable String clientId) {
        return ResponseEntity.ok(clientService.deactivateClient(clientId));
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteClient(@PathVariable String clientId) {
        clientService.deleteClient(clientId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{clientId}/bucket")
    public ResponseEntity<BucketStateResponse> getBucketState(
            @PathVariable String clientId) {
        return ResponseEntity.ok(clientService.getBucketState(clientId));
    }
}
