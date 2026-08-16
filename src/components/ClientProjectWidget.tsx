import { useEffect, useState } from "react";
import { floatClient, personName, departmentNames } from "../lib/floatClient";
import type { Client, Department, Person, Project } from "../types/float";
import { StatusBadge } from "./StatusBadge";

export function ClientProjectWidget() {
  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    floatClient.getSnapshot().then((snapshot) => {
      setClients(snapshot.clients);
      setDepartments(snapshot.departments);
      setPeople(snapshot.people);
      setSelectedClientId(snapshot.clients[0]?.id ?? "");
    });
  }, []);

  useEffect(() => {
    if (!selectedClientId) return;
    setLoading(true);
    floatClient.getProjectsForClient(selectedClientId).then((result) => {
      setProjects(result);
      setLoading(false);
    });
  }, [selectedClientId]);

  return (
    <section className="card">
      <h2>Client projects</h2>
      <p className="card-subtitle">All projects underway for a selected client</p>

      <div className="widget-toolbar">
        <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="empty-state">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="empty-state">No projects found for this client.</p>
      ) : (
        <ul className="project-list">
          {projects.map((p) => (
            <li key={p.id} className="project-row">
              <div className="project-row-top">
                <span className="project-name">{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <div className="project-meta">{departmentNames(departments, p.departmentIds)}</div>
              <div className="project-meta">PM: {personName(people, p.projectManagerId)}</div>
              <div className="project-meta">
                {p.startDate} → {p.endDate}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
