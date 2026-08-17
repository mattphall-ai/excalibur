import "./index.css";
import { DataSourceBanner } from "./components/DataSourceBanner";
import { ChatPanel } from "./components/ChatPanel";
import { ClientProjectWidget } from "./components/ClientProjectWidget";
import { SyntheticWidget } from "./components/SyntheticWidget";

export default function App() {
  return (
    <div className="app">
      <div className="app-header">
        <h1>Studio Rx Content Schedule</h1>
      </div>
      <DataSourceBanner />

      <div className="layout">
        <ChatPanel />
        <div className="widgets-column">
          <ClientProjectWidget />
          <SyntheticWidget />
        </div>
      </div>
    </div>
  );
}
