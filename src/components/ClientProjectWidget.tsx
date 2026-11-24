import { useEffect, useState } from "react";
import { floatClient, personName, departmentNames, stageName } from "../lib/floatClient";
import type { Client, Department, Person, Project, ProjectStage } from "../types/float";
import { StatusBadge } from "./StatusBadge";

export function ClientProjectWidget() {
  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    floatClient.getSnapshot().then((snapshot) => {
      setClients(snapshot.clients);
      setDepartments(snapshot.departments);
      setPeople(snapshot.people);
      setStages(snapshot.stages);
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
        <div className="project-table-wrap">
          <table className="project-table">
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Stage</th>
                <th scope="col">Status</th>
                <th scope="col">Dates</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="project-name">{p.name}</div>
                    <div className="project-meta-line">
                      <span className="project-meta">{departmentNames(departments, p.departmentIds)}</span>
                      <span className="project-meta">PM: {personName(people, p.projectManagerId)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="stage-label">{stageName(stages, p.stageId)}</span>
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="project-dates">
                    {p.startDate}
                    <br />
                    {p.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
