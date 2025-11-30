// Topic: payment.initiated
// Published by: Gateway Service (after client initiation via REST POST /v1/payments)
// Triggers next: Compliance Service subscribes and performs fraud/AML checks; if cleared, publishes compliance.cleared to start authorization.
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Payment Initiated Event",
  "type": "object",
  "required": ["version", "eventId", "timestamp", "transactionId", "paymentType", "amount", "currency"],
  "properties": {
    "version": {
      "type": "string",
      "description": "Schema version for backward compatibility",
      "example": "1.0"
    },
    "eventId": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier for idempotency (prevents duplicate processing)",
      "example": "123e4567-e89b-12d3-a456-426614174000"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 UTC timestamp for event ordering and replays",
      "example": "2025-11-27T12:00:00Z"
    },
    "transactionId": {
      "type": "string",
      "description": "Correlation ID linking to the overall transaction",
      "example": "tx-789"
    },
    "paymentType": {
      "type": "string",
      "enum": ["card", "pos", "transfer", "interbank", "wallet", "upi", "crypto"],
      "description": "Type of payment method being initiated",
      "example": "card"
    },
    "amount": {
      "type": "number",
      "minimum": 0.01,
      "description": "Transaction amount",
      "example": 100.50
    },
    "currency": {
      "type": "string",
      "description": "ISO 4217 currency code",
      "example": "USD"
    },
    "details": {
      "type": "object",
      "additionalProperties": true,
      "description": "Method-specific details (e.g., card info or wallet ID)",
      "example": {
        "cardNumber": "4111111111111111",
        "expiry": "12/28",
        "cvv": "123"
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "description": "User initiating the payment",
          "example": "user-123"
        }
      }
    }
  }
}

// Topic: compliance.cleared
// Published by: Compliance Service (after successful fraud/AML scan via POST /v1/check-compliance)
// Triggers next: Authorization Service subscribes and performs auth/tokenization; if approved, publishes auth.approved to advance to settlement.
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Compliance Cleared Event",
  "type": "object",
  "required": ["version", "eventId", "timestamp", "transactionId", "compliant"],
  "properties": {
    "version": {
      "type": "string",
      "example": "1.0"
    },
    "eventId": {
      "type": "string",
      "format": "uuid",
      "example": "123e4567-e89b-12d3-a456-426614174001"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2025-11-27T12:01:00Z"
    },
    "transactionId": {
      "type": "string",
      "example": "tx-789"
    },
    "compliant": {
      "type": "boolean",
      "description": "True if passed checks (false triggers saga failure/compensation)",
      "example": true
    },
    "flags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Any raised flags (e.g., for monitoring)",
      "example": ["high_velocity"]
    },
    "riskScore": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Calculated risk score (threshold-based)",
      "example": 0.15
    }
  }
}

// Topic: auth.approved
// Published by: Authorization Service (after successful authorization via POST /v1/authorize)
// Triggers next: Settlement Service subscribes and starts saga orchestration (deduct/settle); on success, publishes settlement.completed.
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Authorization Approved Event",
  "type": "object",
  "required": ["version", "eventId", "timestamp", "transactionId", "approved"],
  "properties": {
    "version": {
      "type": "string",
      "example": "1.0"
    },
    "eventId": {
      "type": "string",
      "format": "uuid",
      "example": "123e4567-e89b-12d3-a456-426614174002"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2025-11-27T12:02:00Z"
    },
    "transactionId": {
      "type": "string",
      "example": "tx-789"
    },
    "approved": {
      "type": "boolean",
      "description": "True if authorized (false triggers compensation in saga)",
      "example": true
    },
    "authCode": {
      "type": "string",
      "description": "Code for downstream settlement",
      "example": "auth-123"
    },
    "reason": {
      "type": "string",
      "description": "Approval/denial explanation",
      "example": "sufficient_funds"
    }
  }
}


// Topic: settlement.completed
// Published by: Settlement Service (after successful saga steps via POST /v1/settle or batch)
// Triggers next: Reconciliation Service subscribes for audits; Notification Service subscribes for alerts; completes the happy path flow.
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Settlement Completed Event",
  "type": "object",
  "required": ["version", "eventId", "timestamp", "transactionId", "status"],
  "properties": {
    "version": {
      "type": "string",
      "example": "1.0"
    },
    "eventId": {
      "type": "string",
      "format": "uuid",
      "example": "123e4567-e89b-12d3-a456-426614174003"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2025-11-27T12:03:00Z"
    },
    "transactionId": {
      "type": "string",
      "example": "tx-789"
    },
    "status": {
      "type": "string",
      "enum": ["success", "failed"],
      "description": "Settlement outcome (failed triggers saga.failed)",
      "example": "success"
    },
    "settlementId": {
      "type": "string",
      "example": "set-456"
    },
    "fee": {
      "type": "number",
      "example": 1.50
    },
    "settlementDetails": {
      "type": "object",
      "additionalProperties": true,
      "description": "Details like batchId for interbank",
      "example": {"batchId": "batch-789"}
    }
  }
}

// Topic: reconciliation.matched
// Published by: Reconciliation Service (after audit via POST /v1/reconcile)
// Triggers next: Typically ends the flow; if discrepant, may publish to Notification for alerts or admin review (optional extension).
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Reconciliation Matched Event",
  "type": "object",
  "required": ["version", "eventId", "timestamp", "transactionId", "status"],
  "properties": {
    "version": {
      "type": "string",
      "example": "1.0"
    },
    "eventId": {
      "type": "string",
      "format": "uuid",
      "example": "123e4567-e89b-12d3-a456-426614174004"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2025-11-27T12:04:00Z"
    },
    "transactionId": {
      "type": "string",
      "example": "tx-789"
    },
    "status": {
      "type": "string",
      "enum": ["matched", "discrepant"],
      "example": "matched"
    },
    "discrepancyAmount": {
      "type": "number",
      "description": "Discrepancy value (0 if matched)",
      "example": 0.00
    }
  }
}

// Topic: notification.sent
// Published by: Notification Service (after sending alert via POST /v1/notify or subscription)
// Triggers next: Flow ends; this is the final user-facing event, confirming delivery (e.g., for logging or UI updates).
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Notification Sent Event",
  "type": "object",
  "required": ["version", "eventId", "timestamp", "transactionId", "status"],
  "properties": {
    "version": {
      "type": "string",
      "example": "1.0"
    },
    "eventId": {
      "type": "string",
      "format": "uuid",
      "example": "123e4567-e89b-12d3-a456-426614174005"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2025-11-27T12:05:00Z"
    },
    "transactionId": {
      "type": "string",
      "example": "tx-789"
    },
    "status": {
      "type": "string",
      "enum": ["sent", "delivered", "failed"],
      "example": "sent"
    },
    "channel": {
      "type": "string",
      "enum": ["email", "sms", "push"],
      "example": "email"
    },
    "recipient": {
      "type": "string",
      "example": "user@example.com"
    }
  }
}


// Topic: saga.failed
// Published by: Settlement Service (on saga compensation failure in any step, e.g., auth or settlement)
// Triggers next: Notification Service subscribes for failure alerts; Reconciliation may log for audits; rolls back the flow via compensations (e.g., reverse auth, refund deduct).
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Saga Failed Event",
  "type": "object",
  "required": ["version", "eventId", "timestamp", "transactionId", "reason"],
  "properties": {
    "version": {
      "type": "string",
      "example": "1.0"
    },
    "eventId": {
      "type": "string",
      "format": "uuid",
      "example": "123e4567-e89b-12d3-a456-426614174006"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2025-11-27T12:06:00Z"
    },
    "transactionId": {
      "type": "string",
      "example": "tx-789"
    },
    "reason": {
      "type": "string",
      "description": "Failure cause (e.g., network error, insufficient funds)",
      "example": "insufficient_funds"
    },
    "compensatedSteps": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Reversed steps in compensation",
      "example": ["reverse_auth", "notify_user"]
    }
  }
}


