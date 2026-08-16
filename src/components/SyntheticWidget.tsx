import { useEffect, useState } from "react";
import { floatClient, clientName } from "../lib/floatClient";
import type { Client, Department, Person, Project, ProjectStatus } from "../types/float";
import { StatusBadge } from "./StatusBadge";

const DEPARTMENT_NAME = "Synthetic";

function countByStatus(projects: Project[], status: ProjectStatus): number {
  return projects.filter((p) => p.status === status).length;
}

export function SyntheticWidget() {
  const [department, setDepartment] = useState<Department | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [snapshot, departments] = await Promise.all([floatClient.getSnapshot(), floatClient.listDepartments()]);
      const dept = departments.find((d) => d.name === DEPARTMENT_NAME) ?? null;
      setClients(snapshot.clients);
      setDepartment(dept);
      if (dept) {
        const [deptProjects, deptPeople] = await Promise.all([
          floatClient.getProjectsForDepartment(dept.id),
          floatClient.getPeopleForDepartment(dept.id),
        ]);
        setProjects(deptProjects);
        setTeam(deptPeople);
      }
      setLoading(false);
    }
    load();
  }, []);

  const activeProjects = projects.filter((p) => p.status === "Active" || p.status === "Planned");

  return (
    <section className="card">
      <h2>Synthetic department</h2>
      <p className="card-subtitle">Projects underway by the Synthetic team</p>

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : !department ? (
        <p className="empty-state">Synthetic department not found in the sample data.</p>
      ) : (
        <>
          <div className="stat-row">
            <div className="stat-tile">
              <div className="stat-value">{countByStatus(projects, "Active")}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-tile">
              <div className="stat-value">{countByStatus(projects, "Planned")}</div>
              <div className="stat-label">Planned</div>
            </div>
            <div className="stat-tile">
              <div className="stat-value">{team.length}</div>
              <div className="stat-label">Team members</div>
            </div>
          </div>

          <div className="section-label">Projects underway</div>
          {activeProjects.length === 0 ? (
            <p className="empty-state">No active or planned Synthetic projects.</p>
          ) : (
            <ul className="project-list">
              {activeProjects.map((p) => (
                <li key={p.id} className="project-row">
                  <div className="project-row-top">
                    <span className="project-name">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="project-meta">{clientName(clients, p.clientId)}</div>
                  <div className="project-meta">
                    {p.startDate} → {p.endDate}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="section-label">Team roster</div>
          <div className="roster">
            {team.map((person) => (
              <span key={person.id} className="roster-chip">
                {person.name} · {person.role}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
