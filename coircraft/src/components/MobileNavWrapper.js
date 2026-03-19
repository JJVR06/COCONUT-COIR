"use client";
import dynamic from "next/dynamic";

const MobileBottomNav = dynamic(
  () => import("@/components/MobileBottomNav"),
  { ssr: false }
);

export default function MobileNavWrapper() {
  return <MobileBottomNav />;
}