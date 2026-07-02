-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."otp_challenges" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."tool_runs" (
    "id" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "errorCode" TEXT,
    "inputBytes" INTEGER,
    "outputBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "apiKeyId" TEXT,
    CONSTRAINT "tool_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."artifacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "toolRunId" TEXT,
    CONSTRAINT "artifacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."rate_limit_buckets" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "services" TEXT[],
    "budget" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "currentWebsite" TEXT,
    "specialRequirements" TEXT,
    "competitors" TEXT,
    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."proposals" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "pdfUrl" TEXT,
    "fileName" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewed" TIMESTAMP(3),
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "downloadedAt" TIMESTAMP(3),
    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "problemsContent" JSONB NOT NULL,
    "solutionsContent" JSONB NOT NULL,
    "pricingStructure" JSONB NOT NULL,
    "caseStudyData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
CREATE INDEX "otp_challenges_email_createdAt_idx" ON "public"."otp_challenges"("email", "createdAt");
CREATE INDEX "otp_challenges_expiresAt_idx" ON "public"."otp_challenges"("expiresAt");
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "public"."sessions"("tokenHash");
CREATE INDEX "sessions_userId_idx" ON "public"."sessions"("userId");
CREATE INDEX "sessions_expiresAt_idx" ON "public"."sessions"("expiresAt");
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "public"."api_keys"("keyHash");
CREATE INDEX "api_keys_userId_idx" ON "public"."api_keys"("userId");
CREATE INDEX "api_keys_prefix_idx" ON "public"."api_keys"("prefix");
CREATE INDEX "tool_runs_toolName_createdAt_idx" ON "public"."tool_runs"("toolName", "createdAt");
CREATE INDEX "tool_runs_userId_createdAt_idx" ON "public"."tool_runs"("userId", "createdAt");
CREATE INDEX "tool_runs_apiKeyId_createdAt_idx" ON "public"."tool_runs"("apiKeyId", "createdAt");
CREATE INDEX "artifacts_userId_createdAt_idx" ON "public"."artifacts"("userId", "createdAt");
CREATE INDEX "artifacts_expiresAt_idx" ON "public"."artifacts"("expiresAt");
CREATE INDEX "rate_limit_buckets_userId_scope_idx" ON "public"."rate_limit_buckets"("userId", "scope");
CREATE INDEX "rate_limit_buckets_resetAt_idx" ON "public"."rate_limit_buckets"("resetAt");
CREATE UNIQUE INDEX "rate_limit_buckets_scope_bucketKey_key" ON "public"."rate_limit_buckets"("scope", "bucketKey");
CREATE UNIQUE INDEX "templates_industry_key" ON "public"."templates"("industry");

ALTER TABLE "public"."otp_challenges" ADD CONSTRAINT "otp_challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."tool_runs" ADD CONSTRAINT "tool_runs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."tool_runs" ADD CONSTRAINT "tool_runs_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "public"."api_keys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."artifacts" ADD CONSTRAINT "artifacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."artifacts" ADD CONSTRAINT "artifacts_toolRunId_fkey" FOREIGN KEY ("toolRunId") REFERENCES "public"."tool_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."rate_limit_buckets" ADD CONSTRAINT "rate_limit_buckets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."proposals" ADD CONSTRAINT "proposals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
