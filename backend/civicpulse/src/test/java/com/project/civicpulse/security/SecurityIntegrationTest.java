package com.project.civicpulse.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.civicpulse.dto.LoginRequest;
import com.project.civicpulse.dto.ProvisionAdminRequest;
import com.project.civicpulse.dto.RegisterRequest;
import com.project.civicpulse.entity.AuditLog;
import com.project.civicpulse.entity.Report;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.AuditLogRepository;
import com.project.civicpulse.repository.ReportRepository;
import com.project.civicpulse.repository.UserRepository;
import java.util.List;
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

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    private static int counter = 100;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    private synchronized int nextId() {
        return ++counter;
    }

    // =========================================================================
    // SCENARIO 1: Citizen A creates a report; Citizen A can retrieve it.
    // =========================================================================
    @Test
    @DisplayName("Scenario 1: Citizen A creates a report and can retrieve it")
    void scenario01_citizenACanCreateAndRetrieveReport() throws Exception {
        int id = nextId();
        String aliceEmail = "alice-" + id + "@example.com";
        String aliceToken = registerAndGetToken(aliceEmail, "StrongPass123!");

        // Alice creates report
        String res = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + aliceToken)
                .content("{\"title\":\"Broken Streetlight\",\"description\":\"Streetlight flickering and broken on 4th block near park.\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.title").value("Broken Streetlight"))
            .andReturn().getResponse().getContentAsString();

        Long reportId = objectMapper.readTree(res).get("id").asLong();

        // Alice retrieves her own report
        mockMvc.perform(get("/api/reports/{id}", reportId)
                .header("Authorization", "Bearer " + aliceToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(reportId))
            .andExpect(jsonPath("$.title").value("Broken Streetlight"));
    }

    // =========================================================================
    // SCENARIO 2: Citizen B cannot retrieve Citizen A's restricted report by guessing ID.
    // =========================================================================
    @Test
    @DisplayName("Scenario 2: Citizen B cannot retrieve Citizen A's restricted report (403 Forbidden)")
    void scenario02_citizenBCannotRetrieveCitizenAReport() throws Exception {
        int id = nextId();
        String aliceEmail = "alice-" + id + "@example.com";
        String bobEmail = "bob-" + id + "@example.com";
        String aliceToken = registerAndGetToken(aliceEmail, "StrongPass123!");
        String bobToken = registerAndGetToken(bobEmail, "StrongPass123!");

        // Alice creates report
        String res = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + aliceToken)
                .content("{\"title\":\"Alice Private Issue\",\"description\":\"Private municipal complaint regarding drainage.\"}"))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        Long reportId = objectMapper.readTree(res).get("id").asLong();

        // Bob attempts to retrieve Alice's report -> 403 Forbidden
        mockMvc.perform(get("/api/reports/{id}", reportId)
                .header("Authorization", "Bearer " + bobToken))
            .andExpect(status().isForbidden());
    }

    // =========================================================================
    // SCENARIO 3: Citizen B's /api/reports/my response excludes Citizen A's reports.
    // =========================================================================
    @Test
    @DisplayName("Scenario 3: Citizen B's /api/reports/my excludes Citizen A's reports")
    void scenario03_citizenBMyReportsExcludesCitizenAReports() throws Exception {
        int id = nextId();
        String aliceEmail = "alice-" + id + "@example.com";
        String bobEmail = "bob-" + id + "@example.com";
        String aliceToken = registerAndGetToken(aliceEmail, "StrongPass123!");
        String bobToken = registerAndGetToken(bobEmail, "StrongPass123!");

        // Alice creates report
        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + aliceToken)
                .content("{\"title\":\"Alice Report Exclude Test\",\"description\":\"Should only be visible to Alice.\"}"))
            .andExpect(status().isCreated());

        // Bob requests his reports
        String bobRes = mockMvc.perform(get("/api/reports/my")
                .header("Authorization", "Bearer " + bobToken))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();

        JsonNode bobReports = objectMapper.readTree(bobRes);
        assertTrue(bobReports.isArray());
        for (JsonNode rep : bobReports) {
            assertNotEquals("Alice Report Exclude Test", rep.get("title").asText());
        }
    }

    // =========================================================================
    // SCENARIO 4: Registration with role "ADMIN" does not create administrator.
    // =========================================================================
    @Test
    @DisplayName("Scenario 4: Registration with role ADMIN is forced to CITIZEN")
    void scenario04_registrationWithRoleAdminCreatesCitizen() throws Exception {
        int id = nextId();
        String attackerEmail = "attacker-admin-" + id + "@example.com";

        // Attacker attempts to register with role ADMIN
        String res = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Fake Admin\",\"email\":\"" + attackerEmail + "\",\"password\":\"StrongPass123!\",\"role\":\"ADMIN\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.role").value("CITIZEN"))
            .andReturn().getResponse().getContentAsString();

        // Verify in database that account role is strictly CITIZEN
        User user = userRepository.findByEmail(attackerEmail).orElseThrow();
        assertEquals(UserRole.CITIZEN, user.getRole(), "Public registration must force CITIZEN role");
    }

    // =========================================================================
    // SCENARIO 5: Registration with role "SUPER_ADMIN" does not create system administrator.
    // =========================================================================
    @Test
    @DisplayName("Scenario 5: Registration with role SUPER_ADMIN is forced to CITIZEN")
    void scenario05_registrationWithRoleSuperAdminCreatesCitizen() throws Exception {
        int id = nextId();
        String attackerEmail = "attacker-super-" + id + "@example.com";

        // Attacker attempts to register with role SUPER_ADMIN
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Fake Super Admin\",\"email\":\"" + attackerEmail + "\",\"password\":\"StrongPass123!\",\"role\":\"SUPER_ADMIN\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.role").value("CITIZEN"));

        // Verify in database that account role is strictly CITIZEN
        User user = userRepository.findByEmail(attackerEmail).orElseThrow();
        assertEquals(UserRole.CITIZEN, user.getRole(), "Public registration must never create SUPER_ADMIN");
    }

    // =========================================================================
    // SCENARIO 6: An unauthenticated request cannot access protected endpoints.
    // =========================================================================
    @Test
    @DisplayName("Scenario 6: Unauthenticated request cannot access protected endpoints (401)")
    void scenario06_unauthenticatedRequestCannotAccessProtectedEndpoints() throws Exception {
        // Unauthenticated access to citizen reports -> 401
        mockMvc.perform(get("/api/reports/my"))
            .andExpect(status().isUnauthorized());

        // Unauthenticated access to admin reports -> 401
        mockMvc.perform(get("/api/admin/reports"))
            .andExpect(status().isUnauthorized());

        // Unauthenticated access to admin provisioning -> 401
        mockMvc.perform(post("/api/admin/users/provision")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"12345678\",\"role\":\"ADMIN\"}"))
            .andExpect(status().isUnauthorized());
    }

    // =========================================================================
    // SCENARIO 7: A citizen cannot access admin endpoints.
    // =========================================================================
    @Test
    @DisplayName("Scenario 7: Citizen cannot access admin endpoints (403 Forbidden)")
    void scenario07_citizenCannotAccessAdminEndpoints() throws Exception {
        int id = nextId();
        String citizenEmail = "citizen-" + id + "@example.com";
        String citizenToken = registerAndGetToken(citizenEmail, "StrongPass123!");

        // Citizen calls /api/admin/reports -> 403
        mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isForbidden());

        // Citizen calls /api/admin/citizens -> 403
        mockMvc.perform(get("/api/admin/citizens")
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isForbidden());

        // Citizen calls /api/admin/users -> 403
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isForbidden());
    }

    // =========================================================================
    // SCENARIO 8: Admin A cannot access or modify an incident restricted to Admin B.
    // =========================================================================
    @Test
    @DisplayName("Scenario 8: Admin-to-Admin record isolation (Admin A cannot view/modify Admin B's incident)")
    void scenario08_adminToAdminIsolation() throws Exception {
        int id = nextId();
        String superAdminToken = loginAndGetToken("superadmin@civicpulse.local", "AdminPass123!");

        // Provision Admin A
        String adminAEmail = "admin-a-" + id + "@civicpulse.local";
        provisionAdmin(superAdminToken, adminAEmail, "AdminA");
        String adminAToken = loginAndGetToken(adminAEmail, "AdminPass123!");

        // Provision Admin B
        String adminBEmail = "admin-b-" + id + "@civicpulse.local";
        provisionAdmin(superAdminToken, adminBEmail, "AdminB");
        String adminBToken = loginAndGetToken(adminBEmail, "AdminPass123!");
        User adminBUser = userRepository.findByEmail(adminBEmail).orElseThrow();

        // Citizen creates a report
        String citizenToken = registerAndGetToken("citizen-" + id + "@example.com", "StrongPass123!");
        String createRes = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"title\":\"Scattering Garbage\",\"description\":\"Garbage pile blocking pedestrian walkway.\"}"))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        Long reportId = objectMapper.readTree(createRes).get("id").asLong();

        // SuperAdmin assigns report to Admin B
        mockMvc.perform(patch("/api/admin/reports/{id}/assign", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content("{\"adminId\":" + adminBUser.getId() + "}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.assignedAdminEmail").value(adminBEmail));

        // 1. Admin A attempts to read Admin B's report -> 403 Forbidden
        mockMvc.perform(get("/api/admin/reports/{id}", reportId)
                .header("Authorization", "Bearer " + adminAToken))
            .andExpect(status().isForbidden());

        // 2. Admin A attempts to update status on Admin B's report -> 403 Forbidden
        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminAToken)
                .content("{\"status\":\"IN_PROGRESS\",\"assignedTeam\":\"Unauthorized Team\"}"))
            .andExpect(status().isForbidden());

        // 3. Admin A's list excludes Admin B's assigned report
        String listRes = mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer " + adminAToken))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();
        JsonNode adminAList = objectMapper.readTree(listRes);
        for (JsonNode rep : adminAList) {
            assertNotEquals(reportId, rep.get("id").asLong(), "Admin A must not see Admin B's restricted report");
        }

        // 4. Admin B can successfully access and update the assigned report
        mockMvc.perform(get("/api/admin/reports/{id}", reportId)
                .header("Authorization", "Bearer " + adminBToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(reportId));

        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminBToken)
                .content("{\"status\":\"IN_PROGRESS\",\"assignedTeam\":\"BBMP Sanitation Unit\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    // =========================================================================
    // SCENARIO 9: Admin A cannot modify another admin's identity, permissions, or account.
    // =========================================================================
    @Test
    @DisplayName("Scenario 9: Municipal Admin cannot manage user accounts (403 Forbidden)")
    void scenario09_municipalAdminCannotManageUserAccounts() throws Exception {
        String adminToken = loginAndGetToken("admin@civicpulse.local", "AdminPass123!");

        // Municipal admin tries to provision new user -> 403
        mockMvc.perform(post("/api/admin/users/provision")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content("{\"name\":\"Hacked Admin\",\"email\":\"hacked@civicpulse.local\",\"password\":\"AdminPass123!\",\"role\":\"ADMIN\"}"))
            .andExpect(status().isForbidden());

        // Municipal admin tries to list all user accounts -> 403
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isForbidden());

        // Municipal admin tries to disable an account -> 403
        mockMvc.perform(patch("/api/admin/users/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content("{\"enabled\":false}"))
            .andExpect(status().isForbidden());
    }

    // =========================================================================
    // SCENARIO 10: Municipal admin cannot permanently delete a report.
    // =========================================================================
    @Test
    @DisplayName("Scenario 10: Municipal admin cannot delete reports (403 Forbidden)")
    void scenario10_municipalAdminCannotDeleteReport() throws Exception {
        int id = nextId();
        String citizenToken = registerAndGetToken("citizen-" + id + "@example.com", "StrongPass123!");
        String adminToken = loginAndGetToken("admin@civicpulse.local", "AdminPass123!");

        // Create report
        String createRes = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"title\":\"Report To Delete\",\"description\":\"Test delete permissions.\"}"))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        Long reportId = objectMapper.readTree(createRes).get("id").asLong();

        // Municipal admin attempts DELETE -> 403 Forbidden
        mockMvc.perform(delete("/api/admin/reports/{id}", reportId)
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isForbidden());

        // Verify report still exists in database
        Report rep = reportRepository.findById(reportId).orElseThrow();
        assertFalse(rep.isDeleted(), "Report must not be deleted by municipal admin");
    }

    // =========================================================================
    // SCENARIO 11: Privileged system administrator can perform audited soft-delete.
    // =========================================================================
    @Test
    @DisplayName("Scenario 11: Super Admin can perform audited soft-delete")
    void scenario11_superAdminCanPerformAuditedSoftDelete() throws Exception {
        int id = nextId();
        String citizenToken = registerAndGetToken("citizen-" + id + "@example.com", "StrongPass123!");
        String superAdminToken = loginAndGetToken("superadmin@civicpulse.local", "AdminPass123!");

        // Create report
        String createRes = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"title\":\"Duplicate Report\",\"description\":\"Accidental duplicate submission.\"}"))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        Long reportId = objectMapper.readTree(createRes).get("id").asLong();

        // Super Admin deletes report
        mockMvc.perform(delete("/api/admin/reports/{id}", reportId)
                .param("reason", "Duplicate test ticket")
                .header("Authorization", "Bearer " + superAdminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Report soft-deleted successfully"));

        // Verify database: marked as deleted with audit metadata
        Report rep = reportRepository.findById(reportId).orElseThrow();
        assertTrue(rep.isDeleted(), "Report must be flagged as deleted");
        assertEquals("superadmin@civicpulse.local", rep.getDeletedBy());
        assertEquals("Duplicate test ticket", rep.getDeleteReason());

        // Verify AuditLog table contains entry
        List<AuditLog> logs = auditLogRepository.findAll();
        boolean foundAudit = logs.stream().anyMatch(log ->
            "REPORT_SOFT_DELETED".equals(log.getAction()) &&
            String.valueOf(reportId).equals(log.getTargetId())
        );
        assertTrue(foundAudit, "AuditLog table must record REPORT_SOFT_DELETED entry");

        // Citizen trying to get soft-deleted report gets 404
        mockMvc.perform(get("/api/reports/{id}", reportId)
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isNotFound());
    }

    // =========================================================================
    // SCENARIO 12: Invalid status transitions and invalid assignments are rejected.
    // =========================================================================
    @Test
    @DisplayName("Scenario 12: Invalid status transitions are rejected (400 Bad Request)")
    void scenario12_invalidStatusTransitionsAreRejected() throws Exception {
        int id = nextId();
        String citizenToken = registerAndGetToken("citizen-" + id + "@example.com", "StrongPass123!");
        String superAdminToken = loginAndGetToken("superadmin@civicpulse.local", "AdminPass123!");

        // Create report
        String createRes = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"title\":\"Status Validation Test\",\"description\":\"Testing valid transition flow.\"}"))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        Long reportId = objectMapper.readTree(createRes).get("id").asLong();

        // 1. Invalid status value -> 400
        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content("{\"status\":\"NOT_A_VALID_STATUS\"}"))
            .andExpect(status().isBadRequest());

        // 2. Transition PENDING -> RESOLVED -> 200
        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content("{\"status\":\"RESOLVED\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("RESOLVED"));

        // 3. Illegal transition: from terminal state RESOLVED back to PENDING -> 400 Bad Request
        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content("{\"status\":\"PENDING\"}"))
            .andExpect(status().isBadRequest());
    }

    // =========================================================================
    // SCENARIO 13: Unauthorized operations do not modify PostgreSQL records.
    // =========================================================================
    @Test
    @DisplayName("Scenario 13: Unauthorized operations do not alter database records")
    void scenario13_unauthorizedOperationsDoNotModifyRecords() throws Exception {
        int id = nextId();
        String citizenToken = registerAndGetToken("citizen-" + id + "@example.com", "StrongPass123!");

        // Create report
        String createRes = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"title\":\"Immutable Under Attack\",\"description\":\"Ensure record safety.\"}"))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        Long reportId = objectMapper.readTree(createRes).get("id").asLong();

        // Attacker without permissions tries to patch status
        String attackerToken = registerAndGetToken("attacker-" + id + "@example.com", "StrongPass123!");
        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + attackerToken)
                .content("{\"status\":\"RESOLVED\"}"))
            .andExpect(status().isForbidden());

        // Verify database report state remains unchanged (PENDING)
        Report rep = reportRepository.findById(reportId).orElseThrow();
        assertEquals("PENDING", rep.getStatus(), "Database status must not change following unauthorized attempt");
    }

    // =========================================================================
    // SCENARIO 14: Super Admin provisions Admin account successfully.
    // =========================================================================
    @Test
    @DisplayName("Scenario 14: Super Admin can provision new Admin accounts")
    void scenario14_superAdminCanProvisionAdminAccount() throws Exception {
        int id = nextId();
        String superAdminToken = loginAndGetToken("superadmin@civicpulse.local", "AdminPass123!");
        String newAdminEmail = "provisioned-admin-" + id + "@civicpulse.local";

        ProvisionAdminRequest req = new ProvisionAdminRequest();
        req.setName("Municipal Officer " + id);
        req.setEmail(newAdminEmail);
        req.setPassword("OfficerPass123!");
        req.setRole(UserRole.ADMIN);

        mockMvc.perform(post("/api/admin/users/provision")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value(newAdminEmail))
            .andExpect(jsonPath("$.role").value("ADMIN"));

        // Verify newly provisioned admin can log in
        String newAdminToken = loginAndGetToken(newAdminEmail, "OfficerPass123!");
        assertNotNull(newAdminToken);

        // Verify new admin can access admin reports
        mockMvc.perform(get("/api/admin/reports")
                .header("Authorization", "Bearer " + newAdminToken))
            .andExpect(status().isOk());
    }

    // =========================================================================
    // SCENARIO 15: Valid citizen and authorized admin workflows work seamlessly.
    // =========================================================================
    @Test
    @DisplayName("Scenario 15: Full valid citizen and admin workflows execute successfully")
    void scenario15_validCitizenAndAuthorizedAdminWorkflows() throws Exception {
        int id = nextId();
        String citizenEmail = "happy-citizen-" + id + "@example.com";
        String citizenToken = registerAndGetToken(citizenEmail, "StrongPass123!");
        String superAdminToken = loginAndGetToken("superadmin@civicpulse.local", "AdminPass123!");

        // 1. Citizen creates report
        String createRes = mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + citizenToken)
                .content("{\"title\":\"Water Pipe Leak\",\"description\":\"Major water pipeline leakage at 2nd cross.\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("PENDING"))
            .andReturn().getResponse().getContentAsString();
        Long reportId = objectMapper.readTree(createRes).get("id").asLong();

        // 2. Admin sees unassigned report
        mockMvc.perform(get("/api/admin/reports/{id}", reportId)
                .header("Authorization", "Bearer " + superAdminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Water Pipe Leak"));

        // 3. Admin dispatches unit (IN_PROGRESS)
        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content("{\"status\":\"IN_PROGRESS\",\"assignedTeam\":\"BWSSB Emergency Crew\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
            .andExpect(jsonPath("$.assignedTeam").value("BWSSB Emergency Crew"));

        // 4. Citizen retrieves report and sees updated status
        mockMvc.perform(get("/api/reports/{id}", reportId)
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
            .andExpect(jsonPath("$.assignedTeam").value("BWSSB Emergency Crew"));

        // 5. Admin marks as RESOLVED
        mockMvc.perform(patch("/api/admin/reports/{id}/status", reportId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content("{\"status\":\"RESOLVED\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("RESOLVED"));

        // 6. Citizen verifies resolution
        mockMvc.perform(get("/api/reports/{id}", reportId)
                .header("Authorization", "Bearer " + citizenToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("RESOLVED"));
    }

    // =========================================================================
    // Helper Methods
    // =========================================================================

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

    private void provisionAdmin(String superAdminToken, String email, String name) throws Exception {
        ProvisionAdminRequest req = new ProvisionAdminRequest();
        req.setName(name);
        req.setEmail(email);
        req.setPassword("AdminPass123!");
        req.setRole(UserRole.ADMIN);

        mockMvc.perform(post("/api/admin/users/provision")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + superAdminToken)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated());
    }
}
