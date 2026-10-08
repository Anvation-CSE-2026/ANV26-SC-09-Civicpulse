package com.project.civicpulse.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.civicpulse.dto.LoginRequest;
import com.project.civicpulse.dto.RegisterRequest;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    private int testCounter = 0;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
        testCounter++;
    }

    // ===== 1. Citizen can register =====
    @Test
    @DisplayName("1. Citizen can register")
    void citizenCanRegister() throws Exception {
        String email = "citizen-reg-" + testCounter + "@example.com";
        RegisterRequest request = new RegisterRequest();
        request.setName("Citizen Name");
        request.setEmail(email);
        request.setPassword("StrongPass123!");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.userId").exists())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.email").value(email))
            .andExpect(jsonPath("$.role").value("CITIZEN"));
    }

    // ===== 2. Citizen can login =====
    @Test
    @DisplayName("2. Citizen can login")
    void citizenCanLogin() throws Exception {
        String email = "citizen-login-" + testCounter + "@example.com";
        registerUser(email, "StrongPass123!");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword("StrongPass123!");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.email").value(email))
            .andExpect(jsonPath("$.role").value("CITIZEN"));
    }

    // ===== 3. Admin can login =====
    @Test
    @DisplayName("3. Admin can login")
    void adminCanLogin() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@civicpulse.local");
        request.setPassword("AdminPass123!");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    // ===== 4. Password is BCrypt hashed =====
    @Test
    @DisplayName("4. Password is BCrypt hashed")
    void passwordIsBcryptHashed() throws Exception {
        String email = "bcrypt-test-" + testCounter + "@example.com";
        registerUser(email, "StrongPass123!");

        User user = userRepository.findByEmail(email).orElseThrow();
        String stored = user.getPassword();
        assert stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")
            : "Password should be BCrypt hashed, but was: " + stored;
        assert passwordEncoder.matches("StrongPass123!", stored)
            : "BCrypt hash should match the original password";
    }

    // ===== 5. Citizen can create a report =====
    @Test
    @DisplayName("5. Citizen can create a report")
    void citizenCanCreateReport() throws Exception {
        String email = "report-creator-" + testCounter + "@example.com";
        String token = registerAndGetToken(email, "StrongPass123!");

        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .content("{\"title\":\"Pothole on Main St\",\"description\":\"Large pothole causing traffic issues on Main Street near the intersection.\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.title").value("Pothole on Main St"));
    }

    // ===== 6. Citizen cannot access another citizen's private report =====
    @Test
    @DisplayName("6. Citizen cannot access another citizen's private report")
    void citizenCannotAccessAnotherCitizensReport() throws Exception {
        String aliceEmail = "alice-" + testCounter + "@example.com";
        String bobEmail = "bob-" + testCounter + "@example.com";
        String aliceToken = registerAndGetToken(aliceEmail, "StrongPass123!");
        String bobToken = registerAndGetToken(bobEmail, "StrongPass123!");

        // Alice creates a report
        String createResponse = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + aliceToken)
                .content("{\"title\":\"Flooding report\",\"description\":\"Road is flooded and residents are stranded near downtown.\"}"))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

        Long reportId = objectMapper.readTree(createResponse).get("id").asLong();

        // Bob tries to access Alice's report → 403
        mockMvc.perform(get("/api/reports/{id}", reportId)
                .header("Authorization", "Bearer " + bobToken))
            .andExpect(status().isForbidden());
    }

    // ===== 7. Citizen cannot allocate resources =====
    @Test
    @DisplayName("7. Citizen cannot allocate resources")
    void citizenCannotAllocateResources() throws Exception {
        String email = "no-resource-" + testCounter + "@example.com";
        String citizenToken = registerAndGetToken(email, "StrongPass123!");

        mockMvc.perform(post("/api/admin/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"name\":\"Ambulance Unit 7\"}"))
            .andExpect(status().isForbidden());
    }

    // ===== 8. Citizen cannot change incident status =====
    @Test
    @DisplayName("8. Citizen cannot change incident status")
    void citizenCannotChangeIncidentStatus() throws Exception {
        String email = "no-status-" + testCounter + "@example.com";
        String citizenToken = registerAndGetToken(email, "StrongPass123!");

        mockMvc.perform(patch("/api/admin/incidents/{id}/status", 1)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"status\":\"RESOLVED\"}"))
            .andExpect(status().isForbidden());
    }

    // ===== 9. Citizen cannot modify severity directly =====
    @Test
    @DisplayName("9. Citizen cannot modify severity directly")
    void citizenCannotModifySeverity() throws Exception {
        String email = "no-severity-" + testCounter + "@example.com";
        String citizenToken = registerAndGetToken(email, "StrongPass123!");

        mockMvc.perform(post("/api/admin/incidents/{id}/recalculate", 1)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isForbidden());
    }

    // ===== 10. Admin can access all reports =====
    @Test
    @DisplayName("10. Admin can access all reports")
    void adminCanAccessAllReports() throws Exception {
        String adminToken = loginAndGetToken("admin@civicpulse.local", "AdminPass123!");

        mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());
    }

    // ===== 11. Admin can manage incidents =====
    @Test
    @DisplayName("11. Admin can manage incidents")
    void adminCanManageIncidents() throws Exception {
        String adminToken = loginAndGetToken("admin@civicpulse.local", "AdminPass123!");

        mockMvc.perform(get("/api/admin/incidents")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());

        mockMvc.perform(patch("/api/admin/incidents/{id}/status", 1)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content("{\"status\":\"RESOLVED\"}"))
            .andExpect(status().isOk());
    }

    // ===== 12. Admin can allocate/reallocate resources =====
    @Test
    @DisplayName("12. Admin can allocate/reallocate resources")
    void adminCanAllocateResources() throws Exception {
        String adminToken = loginAndGetToken("admin@civicpulse.local", "AdminPass123!");

        mockMvc.perform(post("/api/admin/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content("{\"name\":\"Fire Truck 3\"}"))
            .andExpect(status().isOk());

        mockMvc.perform(post("/api/admin/incidents/{id}/allocate", 1)
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());
    }

    // ===== 13. Missing JWT returns 401 =====
    @Test
    @DisplayName("13. Missing JWT returns 401")
    void missingJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/admin/reports"))
            .andExpect(status().isUnauthorized());
    }

    // ===== 14. Invalid JWT returns 401 =====
    @Test
    @DisplayName("14. Invalid JWT returns 401")
    void invalidJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer this.is.not.a.valid.jwt"))
            .andExpect(status().isUnauthorized());
    }

    // ===== 15. Citizen accessing ADMIN endpoint returns 403 =====
    @Test
    @DisplayName("15. Citizen accessing ADMIN endpoint returns 403")
    void citizenAccessingAdminEndpointReturns403() throws Exception {
        String email = "forbidden-citizen-" + testCounter + "@example.com";
        String citizenToken = registerAndGetToken(email, "StrongPass123!");

        mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isForbidden());
    }

    // ===== 16. Admin endpoint works with valid ADMIN JWT =====
    @Test
    @DisplayName("16. Admin endpoint works with valid ADMIN JWT")
    void adminEndpointWorksWithValidAdminJwt() throws Exception {
        String adminToken = loginAndGetToken("admin@civicpulse.local", "AdminPass123!");

        mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/incidents")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/resources")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());
    }

    // ===== Helper methods =====

    private void registerUser(String email, String password) throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName(email.split("@")[0]);
        request.setEmail(email);
        request.setPassword(password);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated());
    }

    private String registerAndGetToken(String email, String password) throws Exception {
        registerUser(email, password);
        return loginAndGetToken(email, password);
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);

        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        JsonNode json = objectMapper.readTree(response);
        return json.get("token").asText();
    }
}
