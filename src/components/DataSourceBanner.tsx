export function DataSourceBanner() {
  return (
    <div className="data-source-banner">
      <span className="dot" aria-hidden="true" />
      <span>
        Showing temporary sample data. Chat and widgets will switch to live Float
        data once the Float MCP connection is configured (see{" "}
        <code>src/lib/floatClient.ts</code>).
      </span>
    </div>
  );
}
