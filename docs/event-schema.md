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

