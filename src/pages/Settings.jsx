function Settings() {
  return (
    <div className="space-y-8">
      <section className="pixel-panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Workspace settings</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          This prototype is frontend-only. Saved analyses are stored in your browser using localStorage.
        </p>
      </section>

      <section className="pixel-panel p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-950">Data storage</h2>
        <p className="mt-3 text-slate-600">
          No accounts, backend, stock APIs, or AI services are connected yet.
        </p>
      </section>
    </div>
  )
}

export default Settings
