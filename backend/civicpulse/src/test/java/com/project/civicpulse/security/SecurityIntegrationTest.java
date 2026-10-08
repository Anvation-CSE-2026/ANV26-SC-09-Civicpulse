package com.project.civicpulse.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.civicpulse.dto.LoginRequest;
import com.project.civicpulse.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void citizenCanRegister() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Citizen Name");
        request.setEmail("citizen@example.com");
        request.setPassword("StrongPass123!");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.userId").exists())
            .andExpect(jsonPath("$.email").value("citizen@example.com"))
            .andExpect(jsonPath("$.role").value("CITIZEN"));
    }

    @Test
    void citizenCanLogin() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Citizen Name");
        registerRequest.setEmail("login-citizen@example.com");
        registerRequest.setPassword("StrongPass123!");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(registerRequest)))
            .andExpect(status().isCreated());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login-citizen@example.com");
        loginRequest.setPassword("StrongPass123!");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.email").value("login-citizen@example.com"));
    }

    @Test
    void adminCanLogin() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@civicpulse.local");
        request.setPassword("AdminPass123!");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void passwordIsBcryptHashed() {
        String encoded = passwordEncoder.encode("StrongPass123!");
        assert encoded.startsWith("$2a$") || encoded.startsWith("$2b$") || encoded.startsWith("$2y$");
    }

    @Test
    void citizenCannotAccessAnotherCitizensPrivateReport() throws Exception {
        String aliceToken = registerAndLogin("alice@example.com", "StrongPass123!");
        String bobToken = registerAndLogin("bob@example.com", "StrongPass123!");

        String createResponse = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + aliceToken)
                .with(csrf())
                .content("{\"title\":\"Flooding report\",\"description\":\"Road is flooded and residents are stranded.\"}"))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

        Long reportId = objectMapper.readTree(createResponse).get("id").asLong();

        mockMvc.perform(get("/api/reports/{id}", reportId)
                .header("Authorization", "Bearer " + bobToken))
            .andExpect(status().isForbidden());
    }

    @Test
    void citizenCannotAllocateResources() throws Exception {
        String citizenToken = registerAndLogin("resource-user@example.com", "StrongPass123!");

        mockMvc.perform(post("/api/admin/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .with(csrf())
                .content("{\"name\":\"Ambulance Unit 7\"}"))
            .andExpect(status().isForbidden());
    }

    @Test
    void adminEndpointWorksWithValidAdminJwt() throws Exception {
        String adminToken = loginAndGetToken("admin@civicpulse.local", "AdminPass123!");

        mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());
    }

    @Test
    void missingJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/admin/reports"))
            .andExpect(status().isUnauthorized());
    }

    private String registerAndLogin(String email, String password) throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName(email.split("@")[0]);
        request.setEmail(email);
        request.setPassword(password);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated());

        return loginAndGetToken(email, password);
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);

        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        JsonNode json = objectMapper.readTree(response);
        return json.get("token").asText();
    }
}
