"use client";
import dynamic from "next/dynamic";

const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Page() {
  return <DashboardClient />;
}

function Loader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FA" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #E8EDE8", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}