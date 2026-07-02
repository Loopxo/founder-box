-- FounderBox Accountability OS, OAuth, Lemon Squeezy billing, custom flows, proof, and reports.

CREATE TABLE "public"."workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "persona" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."workspace_members" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."oauth_accounts" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."plans" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "interval" TEXT NOT NULL DEFAULT 'month',
    "limits" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'lemonsqueezy',
    "lemonCustomerId" TEXT,
    "lemonSubscriptionId" TEXT,
    "lemonOrderId" TEXT,
    "lemonProductId" TEXT,
    "lemonVariantId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'free',
    "currentPeriodEnd" TIMESTAMP(3),
    "renewsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "customerPortalUrl" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "planId" TEXT,
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."lemonsqueezy_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "eventName" TEXT NOT NULL,
    "lemonObjectId" TEXT,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "lemonsqueezy_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."flows" (
    "id" TEXT NOT NULL,
    "templateKey" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "persona" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    CONSTRAINT "flows_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."flow_versions" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flowId" TEXT NOT NULL,
    CONSTRAINT "flow_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."flow_objects" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flowId" TEXT NOT NULL,
    CONSTRAINT "flow_objects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."flow_fields" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" JSONB,
    "settings" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "objectId" TEXT NOT NULL,
    "targetObjectId" TEXT,
    CONSTRAINT "flow_fields_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."flow_field_options" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fieldId" TEXT NOT NULL,
    CONSTRAINT "flow_field_options_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."flow_views" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flowId" TEXT NOT NULL,
    "objectId" TEXT,
    CONSTRAINT "flow_views_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."dashboards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "flowId" TEXT,
    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."dashboard_widgets" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dashboardId" TEXT NOT NULL,
    CONSTRAINT "dashboard_widgets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."targets" (
    "id" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "period" TEXT NOT NULL DEFAULT 'week',
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "flowId" TEXT,
    CONSTRAINT "targets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."metric_definitions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "flowId" TEXT,
    CONSTRAINT "metric_definitions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."entries" (
    "id" TEXT NOT NULL,
    "happenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "summary" TEXT,
    "systemType" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "workspaceId" TEXT NOT NULL,
    "flowId" TEXT,
    "objectId" TEXT NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."entry_values" (
    "id" TEXT NOT NULL,
    "value" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entryId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    CONSTRAINT "entry_values_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."proof_assets" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT,
    "text" TEXT,
    "fileName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "storageKey" TEXT,
    "metadata" JSONB,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT,
    "entryId" TEXT,
    CONSTRAINT "proof_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."daily_reviews" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "wakeUpTime" TEXT,
    "mood" TEXT,
    "energy" INTEGER,
    "mainGoal" TEXT,
    "revenueTaskDone" BOOLEAN NOT NULL DEFAULT false,
    "productTaskDone" BOOLEAN NOT NULL DEFAULT false,
    "distributionTaskDone" BOOLEAN NOT NULL DEFAULT false,
    "deepWorkMinutes" INTEGER NOT NULL DEFAULT 0,
    "biggestOutput" TEXT,
    "methodWorked" TEXT,
    "vanished" TEXT,
    "endOfDayReview" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "daily_reviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."weekly_reviews" (
    "id" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "summary" TEXT,
    "markdown" TEXT,
    "metrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "weekly_reviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."share_links" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scope" JSONB NOT NULL,
    "redacted" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "weeklyReviewId" TEXT,
    CONSTRAINT "share_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."notification_preferences" (
    "id" TEXT NOT NULL,
    "dailyReminder" BOOLEAN NOT NULL DEFAULT false,
    "weeklyReview" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" TEXT,
    "timezone" TEXT,
    "channelPreferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."audit_events" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT,
    "userId" TEXT,
    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "workspaces_slug_key" ON "public"."workspaces"("slug");
CREATE UNIQUE INDEX "workspace_members_workspaceId_userId_key" ON "public"."workspace_members"("workspaceId", "userId");
CREATE UNIQUE INDEX "oauth_accounts_provider_providerAccountId_key" ON "public"."oauth_accounts"("provider", "providerAccountId");
CREATE UNIQUE INDEX "plans_slug_key" ON "public"."plans"("slug");
CREATE UNIQUE INDEX "subscriptions_lemonSubscriptionId_key" ON "public"."subscriptions"("lemonSubscriptionId");
CREATE UNIQUE INDEX "lemonsqueezy_events_eventId_key" ON "public"."lemonsqueezy_events"("eventId");
CREATE UNIQUE INDEX "flow_versions_flowId_version_key" ON "public"."flow_versions"("flowId", "version");
CREATE UNIQUE INDEX "flow_objects_flowId_key_key" ON "public"."flow_objects"("flowId", "key");
CREATE UNIQUE INDEX "flow_fields_objectId_key_key" ON "public"."flow_fields"("objectId", "key");
CREATE UNIQUE INDEX "flow_field_options_fieldId_value_key" ON "public"."flow_field_options"("fieldId", "value");
CREATE UNIQUE INDEX "metric_definitions_workspaceId_key_key" ON "public"."metric_definitions"("workspaceId", "key");
CREATE UNIQUE INDEX "entry_values_entryId_fieldId_key" ON "public"."entry_values"("entryId", "fieldId");
CREATE UNIQUE INDEX "daily_reviews_workspaceId_userId_date_key" ON "public"."daily_reviews"("workspaceId", "userId", "date");
CREATE UNIQUE INDEX "weekly_reviews_workspaceId_userId_weekStart_key" ON "public"."weekly_reviews"("workspaceId", "userId", "weekStart");
CREATE UNIQUE INDEX "share_links_token_key" ON "public"."share_links"("token");
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "public"."notification_preferences"("userId");

CREATE INDEX "workspace_members_userId_idx" ON "public"."workspace_members"("userId");
CREATE INDEX "oauth_accounts_userId_idx" ON "public"."oauth_accounts"("userId");
CREATE INDEX "oauth_accounts_email_idx" ON "public"."oauth_accounts"("email");
CREATE INDEX "subscriptions_userId_status_idx" ON "public"."subscriptions"("userId", "status");
CREATE INDEX "subscriptions_workspaceId_idx" ON "public"."subscriptions"("workspaceId");
CREATE INDEX "subscriptions_lemonCustomerId_idx" ON "public"."subscriptions"("lemonCustomerId");
CREATE INDEX "subscriptions_lemonVariantId_idx" ON "public"."subscriptions"("lemonVariantId");
CREATE INDEX "lemonsqueezy_events_eventName_createdAt_idx" ON "public"."lemonsqueezy_events"("eventName", "createdAt");
CREATE INDEX "lemonsqueezy_events_lemonObjectId_idx" ON "public"."lemonsqueezy_events"("lemonObjectId");
CREATE INDEX "flows_workspaceId_isActive_idx" ON "public"."flows"("workspaceId", "isActive");
CREATE INDEX "flows_templateKey_idx" ON "public"."flows"("templateKey");
CREATE INDEX "flow_objects_flowId_sortOrder_idx" ON "public"."flow_objects"("flowId", "sortOrder");
CREATE INDEX "flow_fields_objectId_sortOrder_idx" ON "public"."flow_fields"("objectId", "sortOrder");
CREATE INDEX "flow_fields_targetObjectId_idx" ON "public"."flow_fields"("targetObjectId");
CREATE INDEX "flow_field_options_fieldId_sortOrder_idx" ON "public"."flow_field_options"("fieldId", "sortOrder");
CREATE INDEX "flow_views_flowId_idx" ON "public"."flow_views"("flowId");
CREATE INDEX "flow_views_objectId_idx" ON "public"."flow_views"("objectId");
CREATE INDEX "dashboards_workspaceId_idx" ON "public"."dashboards"("workspaceId");
CREATE INDEX "dashboards_flowId_idx" ON "public"."dashboards"("flowId");
CREATE INDEX "dashboard_widgets_dashboardId_sortOrder_idx" ON "public"."dashboard_widgets"("dashboardId", "sortOrder");
CREATE INDEX "targets_workspaceId_metricKey_idx" ON "public"."targets"("workspaceId", "metricKey");
CREATE INDEX "targets_flowId_idx" ON "public"."targets"("flowId");
CREATE INDEX "metric_definitions_flowId_idx" ON "public"."metric_definitions"("flowId");
CREATE INDEX "entries_workspaceId_happenedAt_idx" ON "public"."entries"("workspaceId", "happenedAt");
CREATE INDEX "entries_objectId_happenedAt_idx" ON "public"."entries"("objectId", "happenedAt");
CREATE INDEX "entries_createdById_idx" ON "public"."entries"("createdById");
CREATE INDEX "entries_systemType_idx" ON "public"."entries"("systemType");
CREATE INDEX "entry_values_fieldId_idx" ON "public"."entry_values"("fieldId");
CREATE INDEX "proof_assets_workspaceId_capturedAt_idx" ON "public"."proof_assets"("workspaceId", "capturedAt");
CREATE INDEX "proof_assets_entryId_idx" ON "public"."proof_assets"("entryId");
CREATE INDEX "proof_assets_userId_idx" ON "public"."proof_assets"("userId");
CREATE INDEX "proof_assets_type_idx" ON "public"."proof_assets"("type");
CREATE INDEX "daily_reviews_workspaceId_date_idx" ON "public"."daily_reviews"("workspaceId", "date");
CREATE INDEX "weekly_reviews_workspaceId_weekStart_idx" ON "public"."weekly_reviews"("workspaceId", "weekStart");
CREATE INDEX "share_links_workspaceId_createdAt_idx" ON "public"."share_links"("workspaceId", "createdAt");
CREATE INDEX "share_links_createdById_idx" ON "public"."share_links"("createdById");
CREATE INDEX "audit_events_workspaceId_createdAt_idx" ON "public"."audit_events"("workspaceId", "createdAt");
CREATE INDEX "audit_events_userId_createdAt_idx" ON "public"."audit_events"("userId", "createdAt");
CREATE INDEX "audit_events_action_idx" ON "public"."audit_events"("action");

ALTER TABLE "public"."workspaces" ADD CONSTRAINT "workspaces_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."lemonsqueezy_events" ADD CONSTRAINT "lemonsqueezy_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."flows" ADD CONSTRAINT "flows_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."flow_versions" ADD CONSTRAINT "flow_versions_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."flow_objects" ADD CONSTRAINT "flow_objects_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."flow_fields" ADD CONSTRAINT "flow_fields_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "public"."flow_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."flow_fields" ADD CONSTRAINT "flow_fields_targetObjectId_fkey" FOREIGN KEY ("targetObjectId") REFERENCES "public"."flow_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."flow_field_options" ADD CONSTRAINT "flow_field_options_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."flow_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."flow_views" ADD CONSTRAINT "flow_views_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."flow_views" ADD CONSTRAINT "flow_views_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "public"."flow_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."dashboards" ADD CONSTRAINT "dashboards_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."dashboards" ADD CONSTRAINT "dashboards_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "public"."dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."targets" ADD CONSTRAINT "targets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."targets" ADD CONSTRAINT "targets_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."metric_definitions" ADD CONSTRAINT "metric_definitions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."metric_definitions" ADD CONSTRAINT "metric_definitions_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."entries" ADD CONSTRAINT "entries_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."entries" ADD CONSTRAINT "entries_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "public"."flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."entries" ADD CONSTRAINT "entries_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "public"."flow_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."entries" ADD CONSTRAINT "entries_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."entry_values" ADD CONSTRAINT "entry_values_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "public"."entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."entry_values" ADD CONSTRAINT "entry_values_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."flow_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."proof_assets" ADD CONSTRAINT "proof_assets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."proof_assets" ADD CONSTRAINT "proof_assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."proof_assets" ADD CONSTRAINT "proof_assets_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "public"."entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."daily_reviews" ADD CONSTRAINT "daily_reviews_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."daily_reviews" ADD CONSTRAINT "daily_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."weekly_reviews" ADD CONSTRAINT "weekly_reviews_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."weekly_reviews" ADD CONSTRAINT "weekly_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."share_links" ADD CONSTRAINT "share_links_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."share_links" ADD CONSTRAINT "share_links_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."share_links" ADD CONSTRAINT "share_links_weeklyReviewId_fkey" FOREIGN KEY ("weeklyReviewId") REFERENCES "public"."weekly_reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."audit_events" ADD CONSTRAINT "audit_events_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."audit_events" ADD CONSTRAINT "audit_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
