import type { ProjectStatus } from "../types/float";

const STATUS_CLASS: Record<ProjectStatus, string> = {
  Active: "status-active",
  Planned: "status-planned",
  "On Hold": "status-on-hold",
  Completed: "status-completed",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`status-badge ${STATUS_CLASS[status]}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}
