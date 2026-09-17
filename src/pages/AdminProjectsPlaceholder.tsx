import AdminLayout from "../components/AdminLayout";

export default function AdminProjectsPlaceholder() {
  return (
    <AdminLayout
      title="Projects"
      description="Project management will be introduced in a later phase. The public projects route remains unchanged and continues to read the existing project data."
    >
      <div className="rounded-lg border border-dashed border-border bg-bg-secondary p-8 text-center text-text-secondary">
        Project administration is planned for a future phase.
      </div>
    </AdminLayout>
  );
}
