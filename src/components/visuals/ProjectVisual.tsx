"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/data/projects";

/**
 * Proje → görsel bileşen eşlemesi. Her görsel ayrı chunk olarak yüklenir (code splitting).
 * Yeni görsel eklemek için: bileşeni yazın, burada eşleyin, projede `visual` alanını ayarlayın.
 */
const ErpDashboard = dynamic(() => import("./ErpDashboard").then((m) => m.ErpDashboard));
const IntegrationFlow = dynamic(() => import("./IntegrationFlow").then((m) => m.IntegrationFlow));
const CourierOps = dynamic(() => import("./CourierOps").then((m) => m.CourierOps));
const PosTerminal = dynamic(() => import("./PosTerminal").then((m) => m.PosTerminal));
const QrMenu = dynamic(() => import("./QrMenu").then((m) => m.QrMenu));
const FireSafety = dynamic(() => import("./FireSafety").then((m) => m.FireSafety));
const TenantPlatform = dynamic(() => import("./TenantPlatform").then((m) => m.TenantPlatform));
const ServiceDesk = dynamic(() => import("./ServiceDesk").then((m) => m.ServiceDesk));
const MobilePreview = dynamic(() => import("@/components/mobile-preview").then((m) => m.MobilePreview));

export function ProjectVisual({ project }: { project: Project }) {
  switch (project.visual) {
    case "erp-dashboard":
      return <ErpDashboard />;
    case "integration-flow":
      return <IntegrationFlow />;
    case "mobile-yedinizmi":
      return <MobilePreview appIds={project.mobileApps} variant="compact" />;
    case "courier-ops":
      return <CourierOps />;
    case "pos-terminal":
      return <PosTerminal />;
    case "qr-menu":
      return <QrMenu />;
    case "fire-safety":
      return <FireSafety />;
    case "tenant-platform":
      return <TenantPlatform />;
    case "service-desk":
      return <ServiceDesk />;
    default:
      return null;
  }
}
