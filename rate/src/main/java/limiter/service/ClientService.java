package limiter.service;

import limiter.dto.BucketStateResponse;
import limiter.dto.ClientConfigurationRequest;
import limiter.dto.ClientConfigurationResponse;

import java.util.List;

public interface ClientService {

    ClientConfigurationResponse createClient(ClientConfigurationRequest request);

    List<ClientConfigurationResponse> getAllClients();

    ClientConfigurationResponse getClientByClientId(String clientId);

    ClientConfigurationResponse updateClient(String clientId, ClientConfigurationRequest request);

    ClientConfigurationResponse deactivateClient(String clientId);

    void deleteClient(String clientId);

    BucketStateResponse getBucketState(String clientId);
}
