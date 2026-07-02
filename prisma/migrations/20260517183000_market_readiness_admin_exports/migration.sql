ALTER TABLE "public"."share_links"
ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastViewedAt" TIMESTAMP(3);

CREATE TABLE "public"."share_link_views" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareLinkId" TEXT NOT NULL,
    CONSTRAINT "share_link_views_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."suspicious_usage_flags" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT,
    "userId" TEXT,
    CONSTRAINT "suspicious_usage_flags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."export_jobs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "storageKey" TEXT,
    "downloadUrl" TEXT,
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "export_jobs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "share_link_views_shareLinkId_createdAt_idx" ON "public"."share_link_views"("shareLinkId", "createdAt");
CREATE INDEX "suspicious_usage_flags_workspaceId_createdAt_idx" ON "public"."suspicious_usage_flags"("workspaceId", "createdAt");
CREATE INDEX "suspicious_usage_flags_userId_createdAt_idx" ON "public"."suspicious_usage_flags"("userId", "createdAt");
CREATE INDEX "suspicious_usage_flags_type_status_idx" ON "public"."suspicious_usage_flags"("type", "status");
CREATE INDEX "export_jobs_workspaceId_createdAt_idx" ON "public"."export_jobs"("workspaceId", "createdAt");
CREATE INDEX "export_jobs_userId_createdAt_idx" ON "public"."export_jobs"("userId", "createdAt");
CREATE INDEX "export_jobs_status_idx" ON "public"."export_jobs"("status");
CREATE INDEX "export_jobs_expiresAt_idx" ON "public"."export_jobs"("expiresAt");

ALTER TABLE "public"."share_link_views" ADD CONSTRAINT "share_link_views_shareLinkId_fkey" FOREIGN KEY ("shareLinkId") REFERENCES "public"."share_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."suspicious_usage_flags" ADD CONSTRAINT "suspicious_usage_flags_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."suspicious_usage_flags" ADD CONSTRAINT "suspicious_usage_flags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."export_jobs" ADD CONSTRAINT "export_jobs_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."export_jobs" ADD CONSTRAINT "export_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
