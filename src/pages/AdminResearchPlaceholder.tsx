import AdminLayout from "../components/AdminLayout";

export default function AdminResearchPlaceholder() {
  return (
    <AdminLayout
      title="Research"
      description="Research management will be implemented in a later phase. This is an admin placeholder to keep the section organized without altering the public research experience."
    >
      <div className="rounded-lg border border-dashed border-border bg-bg-secondary p-8 text-center text-text-secondary">
        Management for research entries is not yet available in Phase 1.
      </div>
    </AdminLayout>
  );
}
