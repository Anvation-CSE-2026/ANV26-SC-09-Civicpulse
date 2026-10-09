package com.project.civicpulse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.civicpulse.dto.ReportRequest;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class MlSeverityService {

    @Value("${app.ml.url:http://localhost:8001/predict}")
    private String mlServiceUrl;

    @Value("${app.ml.enabled:true}")
    private boolean mlEnabled;

    @Value("${app.ml.timeout-ms:3000}")
    private int timeoutMs;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MlSeverityService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(2500));
        factory.setReadTimeout(Duration.ofMillis(3000));
        this.restTemplate = new RestTemplate(factory);
    }

    @Getter
    @Setter
    public static class MlPredictionResult {
        private String severityLevel;
        private Integer severityScore;
        private Double confidence;
        private String modelVersion;
        private Map<String, Object> context;
    }

    public MlPredictionResult predictSeverity(ReportRequest request) {
        if (!mlEnabled) {
            log.info("ML prediction is disabled via configuration; using fallback severity.");
            return createFallback(request, "ML disabled by configuration");
        }

        try {
            // Build payload for FastAPI /predict endpoint
            Map<String, Object> payload = new HashMap<>();

            // Prefer specific issue type (e.g. 'Pothole', 'Waterlogging') or category
            String category = request.getIssueType() != null && !request.getIssueType().isBlank()
                ? request.getIssueType()
                : (request.getCategory() != null ? request.getCategory() : "INFRASTRUCTURE");
            payload.put("category", category);

            // Ward / Area
            String ward = request.getWard() != null && !request.getWard().isBlank()
                ? request.getWard()
                : (request.getAreaName() != null ? request.getAreaName() : "Bengaluru");
            payload.put("ward", ward);

            payload.put("latitude", request.getLatitude() != null ? request.getLatitude() : 12.9716);
            payload.put("longitude", request.getLongitude() != null ? request.getLongitude() : 77.5946);

            if (request.getRainfall() != null) payload.put("rainfall", request.getRainfall());
            if (request.getTraffic() != null) payload.put("traffic", request.getTraffic());
            if (request.getPopulation() != null) payload.put("population", request.getPopulation());
            if (request.getDepartment() != null) payload.put("department", request.getDepartment());
            if (request.getDescription() != null) payload.put("description", request.getDescription());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            log.info("Requesting ML severity prediction from {} for category='{}', ward='{}'",
                mlServiceUrl, category, ward);

            ResponseEntity<Map> response = restTemplate.postForEntity(mlServiceUrl, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map body = response.getBody();
                MlPredictionResult result = new MlPredictionResult();
                result.setSeverityLevel((String) body.getOrDefault("severityLevel", "MEDIUM"));
                
                Object scoreObj = body.get("severityScore");
                int score = 65;
                if (scoreObj instanceof Number number) {
                    score = number.intValue();
                }
                result.setSeverityScore(score);

                Object confObj = body.get("confidence");
                double conf = 0.85;
                if (confObj instanceof Number number) {
                    conf = number.doubleValue();
                }
                result.setConfidence(conf);

                result.setModelVersion((String) body.getOrDefault("modelVersion", "civicpulse-v1"));

                Object contextObj = body.get("context");
                if (contextObj instanceof Map mapContext) {
                    result.setContext(mapContext);
                } else {
                    result.setContext(Map.of("raw", body));
                }

                log.info("ML Prediction succeeded: level={}, score={}, confidence={}, modelVersion={}",
                    result.getSeverityLevel(), result.getSeverityScore(), result.getConfidence(), result.getModelVersion());

                return result;
            }
        } catch (Exception ex) {
            log.warn("ML service unavailable — using fallback severity. Reason: {}", ex.getMessage());
        }

        return createFallback(request, "ML service call failed or timed out");
    }

    private MlPredictionResult createFallback(ReportRequest request, String reason) {
        MlPredictionResult fallback = new MlPredictionResult();

        int score = 65;
        if (request.getSeverity() != null && request.getSeverity() > 0 && request.getSeverity() <= 100) {
            score = request.getSeverity();
        } else if (request.getCategory() != null) {
            String cat = request.getCategory().toUpperCase();
            if (cat.contains("SAFETY")) {
                score = 75;
            } else if (cat.contains("UTILITY")) {
                score = 60;
            } else {
                score = 65;
            }
        }

        String level;
        if (score > 80) level = "CRITICAL";
        else if (score > 60) level = "HIGH";
        else if (score > 35) level = "MEDIUM";
        else level = "LOW";

        fallback.setSeverityScore(score);
        fallback.setSeverityLevel(level);
        fallback.setConfidence(0.50);
        fallback.setModelVersion("fallback-deterministic");
        fallback.setContext(Map.of(
            "fallback", true,
            "reason", reason,
            "deterministicScore", score
        ));

        return fallback;
    }
}
