-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- EnableExtensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CreateEnum
CREATE TYPE "profile_role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "profile_status" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "wallet_status" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "wallet_ledger_entry_type" AS ENUM ('stripe_purchase_credit', 'ai_usage_debit', 'admin_credit', 'admin_debit', 'refund_debit', 'reversal_credit');

-- CreateEnum
CREATE TYPE "wallet_ledger_source_type" AS ENUM ('stripe_checkout', 'provider_usage', 'admin', 'refund', 'reversal', 'system');

-- CreateEnum
CREATE TYPE "stripe_checkout_session_status" AS ENUM ('created', 'open', 'complete', 'expired', 'canceled', 'failed');

-- CreateEnum
CREATE TYPE "stripe_event_processing_status" AS ENUM ('received', 'processing', 'processed', 'failed', 'ignored');

-- CreateEnum
CREATE TYPE "ai_request_status" AS ENUM ('pending', 'succeeded', 'failed', 'canceled');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "role" "profile_role" NOT NULL DEFAULT 'user',
    "status" "profile_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "cached_balance_units" BIGINT NOT NULL DEFAULT 0,
    "status" "wallet_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_ledger" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "wallet_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "entry_type" "wallet_ledger_entry_type" NOT NULL,
    "amount_units" BIGINT NOT NULL,
    "balance_before_units" BIGINT NOT NULL,
    "balance_after_units" BIGINT NOT NULL,
    "source_type" "wallet_ledger_source_type" NOT NULL,
    "source_id" TEXT,
    "idempotency_key" TEXT NOT NULL,
    "reason" TEXT,
    "admin_user_id" UUID,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_packages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "credit_units" BIGINT NOT NULL,
    "price_cents" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "stripe_price_id" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "credit_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stripe_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_checkout_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "credit_package_id" UUID NOT NULL,
    "stripe_checkout_session_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "status" "stripe_checkout_session_status" NOT NULL,
    "credit_units" BIGINT NOT NULL,
    "amount_total_cents" BIGINT,
    "currency" TEXT,
    "credited_ledger_entry_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "stripe_checkout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stripe_event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "processing_status" "stripe_event_processing_status" NOT NULL,
    "payload" JSONB NOT NULL,
    "error_message" TEXT,
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),

    CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "ai_request_status" NOT NULL,
    "response_id" TEXT,
    "prompt_preview" TEXT,
    "prompt_hash" TEXT,
    "input_token_estimate" BIGINT,
    "output_token_estimate" BIGINT,
    "error_code" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "ai_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_usage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ai_request_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "input_tokens" BIGINT,
    "output_tokens" BIGINT,
    "total_tokens" BIGINT,
    "provider_cost_micros" BIGINT,
    "credit_units_debited" BIGINT,
    "wallet_ledger_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "admin_user_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profiles_email_idx" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_role_idx" ON "profiles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallets_status_idx" ON "wallets"("status");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_ledger_idempotency_key_key" ON "wallet_ledger"("idempotency_key");

-- CreateIndex
CREATE INDEX "wallet_ledger_wallet_id_idx" ON "wallet_ledger"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_ledger_user_id_idx" ON "wallet_ledger"("user_id");

-- CreateIndex
CREATE INDEX "wallet_ledger_admin_user_id_idx" ON "wallet_ledger"("admin_user_id");

-- CreateIndex
CREATE INDEX "wallet_ledger_source_idx" ON "wallet_ledger"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "wallet_ledger_created_at_idx" ON "wallet_ledger"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "credit_packages_slug_key" ON "credit_packages"("slug");

-- CreateIndex
CREATE INDEX "credit_packages_active_sort_order_idx" ON "credit_packages"("active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_customers_user_id_key" ON "stripe_customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_customers_stripe_customer_id_key" ON "stripe_customers"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_checkout_sessions_stripe_checkout_session_id_key" ON "stripe_checkout_sessions"("stripe_checkout_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_checkout_sessions_credited_ledger_entry_id_key" ON "stripe_checkout_sessions"("credited_ledger_entry_id");

-- CreateIndex
CREATE INDEX "stripe_checkout_sessions_user_id_idx" ON "stripe_checkout_sessions"("user_id");

-- CreateIndex
CREATE INDEX "stripe_checkout_sessions_credit_package_id_idx" ON "stripe_checkout_sessions"("credit_package_id");

-- CreateIndex
CREATE INDEX "stripe_checkout_sessions_status_idx" ON "stripe_checkout_sessions"("status");

-- CreateIndex
CREATE INDEX "stripe_checkout_sessions_created_at_idx" ON "stripe_checkout_sessions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_events_stripe_event_id_key" ON "stripe_events"("stripe_event_id");

-- CreateIndex
CREATE INDEX "stripe_events_processing_status_idx" ON "stripe_events"("processing_status");

-- CreateIndex
CREATE INDEX "stripe_events_received_at_idx" ON "stripe_events"("received_at");

-- CreateIndex
CREATE INDEX "ai_requests_user_id_idx" ON "ai_requests"("user_id");

-- CreateIndex
CREATE INDEX "ai_requests_wallet_id_idx" ON "ai_requests"("wallet_id");

-- CreateIndex
CREATE INDEX "ai_requests_status_idx" ON "ai_requests"("status");

-- CreateIndex
CREATE INDEX "ai_requests_created_at_idx" ON "ai_requests"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "provider_usage_ai_request_id_key" ON "provider_usage"("ai_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_usage_wallet_ledger_id_key" ON "provider_usage"("wallet_ledger_id");

-- CreateIndex
CREATE INDEX "provider_usage_user_id_idx" ON "provider_usage"("user_id");

-- CreateIndex
CREATE INDEX "provider_usage_created_at_idx" ON "provider_usage"("created_at");

-- CreateIndex
CREATE INDEX "admin_audit_log_admin_user_id_idx" ON "admin_audit_log"("admin_user_id");

-- CreateIndex
CREATE INDEX "admin_audit_log_target_idx" ON "admin_audit_log"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "admin_audit_log_created_at_idx" ON "admin_audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_ledger" ADD CONSTRAINT "wallet_ledger_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_ledger" ADD CONSTRAINT "wallet_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_ledger" ADD CONSTRAINT "wallet_ledger_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_customers" ADD CONSTRAINT "stripe_customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_checkout_sessions" ADD CONSTRAINT "stripe_checkout_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_checkout_sessions" ADD CONSTRAINT "stripe_checkout_sessions_credit_package_id_fkey" FOREIGN KEY ("credit_package_id") REFERENCES "credit_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_checkout_sessions" ADD CONSTRAINT "stripe_checkout_sessions_credited_ledger_entry_id_fkey" FOREIGN KEY ("credited_ledger_entry_id") REFERENCES "wallet_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_requests" ADD CONSTRAINT "ai_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_requests" ADD CONSTRAINT "ai_requests_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_usage" ADD CONSTRAINT "provider_usage_ai_request_id_fkey" FOREIGN KEY ("ai_request_id") REFERENCES "ai_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_usage" ADD CONSTRAINT "provider_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_usage" ADD CONSTRAINT "provider_usage_wallet_ledger_id_fkey" FOREIGN KEY ("wallet_ledger_id") REFERENCES "wallet_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_log" ADD CONSTRAINT "admin_audit_log_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- EnableRLS
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wallets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wallet_ledger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credit_packages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stripe_customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stripe_checkout_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stripe_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "provider_usage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_audit_log" ENABLE ROW LEVEL SECURITY;

-- UserOwnedReadPolicies
CREATE POLICY "profiles_select_own" ON "profiles"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "id");

CREATE POLICY "wallets_select_own" ON "wallets"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user_id");

CREATE POLICY "wallet_ledger_select_own" ON "wallet_ledger"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user_id");

CREATE POLICY "stripe_checkout_sessions_select_own" ON "stripe_checkout_sessions"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user_id");

CREATE POLICY "ai_requests_select_own" ON "ai_requests"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user_id");

CREATE POLICY "provider_usage_select_own" ON "provider_usage"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user_id");

CREATE POLICY "credit_packages_select_active" ON "credit_packages"
  FOR SELECT TO anon, authenticated
  USING ("active" = true);
