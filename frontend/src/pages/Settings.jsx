import { settingsOptions } from '../data/mockData'

function Settings() {
  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>SETTINGS</h3>
          <button className="btn btn-primary">SAVE CHANGES</button>
        </div>
        <div className="settings-layout">
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>General settings</h3>
              <span className="muted">Operational defaults</span>
            </div>
            <form className="settings-form">
              <label>
                Depot name
                <input placeholder="Central Depot" />
              </label>
              <label>
                Currency (RS)
                <input placeholder="RS" />
              </label>
              <label>
                Distance unit (KM)
                <input placeholder="KM" />
              </label>
              <button className="btn btn-primary" type="button">SAVE</button>
            </form>
          </div>
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Preferences</h3>
              <span className="muted">Alerts & automation</span>
            </div>
            <div className="settings-list">
              {settingsOptions.map((setting) => (
                <div key={setting.label} className="setting-row">
                  <span>{setting.label}</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked={setting.enabled} />
                    <span className="slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Settings
