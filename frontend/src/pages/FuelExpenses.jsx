import { useEffect, useMemo, useState } from 'react'
import { expenses } from '../data/mockData'
import { createExpense, createFuelLog, getExpenses, getFuelLogs, getVehicles, mapExpense, mapFuelLog, mapVehicle } from '../services/api'

function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState(expenses.slice(0, 2).map((e) => ({ ...e, liters: '48 L' })))
  const [expenseList, setExpenseList] = useState(expenses)
  const [vehicleList, setVehicleList] = useState([])
  const [showFuelForm, setShowFuelForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [fuelForm, setFuelForm] = useState({ vehicle_id: '', fuel_station: '', fuel_date: '', liters: '', cost: '', odometer: '' })
  const [expenseForm, setExpenseForm] = useState({ vehicle_id: '', expense_type: 'Fuel', amount: '', expense_date: '', remarks: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let ignore = false
    Promise.allSettled([getFuelLogs(), getExpenses(), getVehicles()]).then(([f, ex, v]) => {
      if (ignore) return
      if (f.status === 'fulfilled' && Array.isArray(f.value) && f.value.length) setFuelLogs(f.value.map(mapFuelLog))
      if (ex.status === 'fulfilled' && Array.isArray(ex.value) && ex.value.length) setExpenseList(ex.value.map(mapExpense))
      if (v.status === 'fulfilled' && Array.isArray(v.value) && v.value.length) setVehicleList(v.value.map(mapVehicle))
    })
    return () => { ignore = true }
  }, [])

  const totalCost = useMemo(() => {
    const parse = (val) => Number(String(val).replace(/[^0-9.-]+/g, '')) || 0
    return [...fuelLogs, ...expenseList].reduce((s, i) => s + parse(i.amount), 0)
  }, [fuelLogs, expenseList])

  const handleFuelSubmit = async (e) => {
    e.preventDefault()
    if (!fuelForm.liters || !fuelForm.cost) return
    setSaving(true)
    const optimistic = { id: `FL-tmp-${Date.now()}`, vehicle: vehicleList.find(v => String(v.id) === fuelForm.vehicle_id)?.nameModel || '-', date: fuelForm.fuel_date || 'Today', liters: `${fuelForm.liters} L`, amount: `Rs ${Number(fuelForm.cost).toLocaleString()}` }
    setFuelLogs(prev => [optimistic, ...prev])
    setShowFuelForm(false)
    setFuelForm({ vehicle_id: '', fuel_station: '', fuel_date: '', liters: '', cost: '', odometer: '' })
    try { const saved = await createFuelLog(fuelForm); if (saved) setFuelLogs(prev => prev.map(f => f.id === optimistic.id ? mapFuelLog(saved) : f)) }
    catch { /* keep optimistic */ } finally { setSaving(false) }
  }

  const handleExpenseSubmit = async (e) => {
    e.preventDefault()
    if (!expenseForm.amount) return
    setSaving(true)
    const optimistic = { id: `EXP-tmp-${Date.now()}`, category: expenseForm.expense_type, amount: `Rs ${Number(expenseForm.amount).toLocaleString()}`, date: expenseForm.expense_date || 'Today', vehicle: vehicleList.find(v => String(v.id) === expenseForm.vehicle_id)?.nameModel || '-' }
    setExpenseList(prev => [optimistic, ...prev])
    setShowExpenseForm(false)
    setExpenseForm({ vehicle_id: '', expense_type: 'Fuel', amount: '', expense_date: '', remarks: '' })
    try { const saved = await createExpense(expenseForm); if (saved) setExpenseList(prev => prev.map(ex => ex.id === optimistic.id ? mapExpense(saved) : ex)) }
    catch { /* keep optimistic */ } finally { setSaving(false) }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>Fuel & Expenses</h3>
          <div className="section-actions">
            <button className="btn btn-secondary" onClick={() => { setShowFuelForm(v => !v); setShowExpenseForm(false) }}>{showFuelForm ? '✕ Cancel' : '+ Fuel log'}</button>
            <button className="btn btn-primary" onClick={() => { setShowExpenseForm(v => !v); setShowFuelForm(false) }}>{showExpenseForm ? '✕ Cancel' : '+ Expense'}</button>
          </div>
        </div>

        {showFuelForm && (
          <div className="inline-form-panel">
            <h4>Add fuel log</h4>
            <form onSubmit={handleFuelSubmit}>
              <div className="form-row">
                <label>Vehicle<select name="vehicle_id" value={fuelForm.vehicle_id} onChange={e => setFuelForm(p => ({ ...p, vehicle_id: e.target.value }))}>
                  <option value="">Select vehicle</option>
                  {vehicleList.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>)}
                </select></label>
                <label>Fuel station<input value={fuelForm.fuel_station} onChange={e => setFuelForm(p => ({ ...p, fuel_station: e.target.value }))} placeholder="HP Petrol, Andheri" /></label>
              </div>
              <div className="form-row">
                <label>Date<input type="date" value={fuelForm.fuel_date} onChange={e => setFuelForm(p => ({ ...p, fuel_date: e.target.value }))} /></label>
                <label>Litres *<input type="number" min="0" value={fuelForm.liters} onChange={e => setFuelForm(p => ({ ...p, liters: e.target.value }))} placeholder="48" required /></label>
                <label>Cost (₹) *<input type="number" min="0" value={fuelForm.cost} onChange={e => setFuelForm(p => ({ ...p, cost: e.target.value }))} placeholder="5760" required /></label>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add fuel log'}</button>
            </form>
          </div>
        )}

        {showExpenseForm && (
          <div className="inline-form-panel">
            <h4>Add expense</h4>
            <form onSubmit={handleExpenseSubmit}>
              <div className="form-row">
                <label>Vehicle<select value={expenseForm.vehicle_id} onChange={e => setExpenseForm(p => ({ ...p, vehicle_id: e.target.value }))}>
                  <option value="">Select vehicle</option>
                  {vehicleList.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>)}
                </select></label>
                <label>Type<select value={expenseForm.expense_type} onChange={e => setExpenseForm(p => ({ ...p, expense_type: e.target.value }))}>
                  <option>Fuel</option><option>Toll</option><option>Repairs</option><option>Parking</option><option>Insurance</option><option>Other</option>
                </select></label>
              </div>
              <div className="form-row">
                <label>Amount (₹) *<input type="number" min="0" value={expenseForm.amount} onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))} placeholder="1200" required /></label>
                <label>Date<input type="date" value={expenseForm.expense_date} onChange={e => setExpenseForm(p => ({ ...p, expense_date: e.target.value }))} /></label>
              </div>
              <label>Remarks<input value={expenseForm.remarks} onChange={e => setExpenseForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Optional notes" /></label>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add expense'}</button>
            </form>
          </div>
        )}

        <div className="fuel-layout">
          <div className="panel soft-panel">
            <div className="section-title"><h3>Fuel log</h3><span className="muted">Recent entries</span></div>
            <div className="table-card">
              <div className="table-row table-head"><div>Vehicle</div><div>Date</div><div>Litres</div><div>Fuel cost</div></div>
              {fuelLogs.map((log) => (
                <div key={log.id} className="table-row">
                  <div>{log.vehicle}</div><div>{log.date}</div><div>{log.liters || '48 L'}</div><div>{log.amount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel soft-panel">
            <div className="section-title"><h3>Other expenses</h3><span className="muted">Tolls & misc.</span></div>
            <div className="table-card">
              <div className="table-row table-head"><div>ID</div><div>Vehicle</div><div>Type</div><div>Total</div></div>
              {expenseList.map((expense) => (
                <div key={expense.id} className="table-row">
                  <div>{expense.id}</div><div>{expense.vehicle}</div><div>{expense.category}</div><div>{expense.amount}</div>
                </div>
              ))}
            </div>
            <div className="summary-card" style={{ marginTop: 10 }}>
              <h4>Total operational cost</h4>
              <p className="muted">Fuel + expenses = <strong>Rs {totalCost.toLocaleString()}</strong></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FuelExpenses
