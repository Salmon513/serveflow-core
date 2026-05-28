CREATE TABLE IF NOT EXISTS bookings (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID        NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  party_size    INTEGER     NOT NULL,
  requested_at  TIMESTAMPTZ NOT NULL,
  confirmed_at  TIMESTAMPTZ,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT bookings_party_size_positive CHECK (party_size > 0),
  CONSTRAINT bookings_status_valid CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed')
  )
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status      ON bookings (status);
