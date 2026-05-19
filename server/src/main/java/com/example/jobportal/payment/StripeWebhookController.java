package com.example.jobportal.payment;

import com.example.jobportal.service.JobCreditService;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/stripe/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final JobCreditService jobCreditService;

    private final String endpointSecret = "whsec_6a20f40bdba58b12f86ea6075c9cc950ccfa51e0f45e9825626bab495bf6795c";

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,
                                                @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

            if ("checkout.session.completed".equals(event.getType())) {

                JsonNode jsonNode = new ObjectMapper().readTree(payload);
                JsonNode sessionData = jsonNode.get("data").get("object");

                String paymentIntent = sessionData.get("payment_intent").asText();
                JsonNode metadata = sessionData.get("metadata");

                Long recruiterId = Long.parseLong(metadata.get("recruiterId").asText());

                jobCreditService.createCredit(recruiterId, paymentIntent);
            }

            return ResponseEntity.ok("success");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("failure");
        }
    }
}