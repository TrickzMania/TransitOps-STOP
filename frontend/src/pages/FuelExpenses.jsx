import { useEffect, useMemo, useState } from 'react'
import { expenses } from '../data/mockData'
import { getExpenses, getFuelLogs, mapExpense, mapFuelLog } from '../services/api'

function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState(expenses.slice(0, 2).map((expense) => ({ ...expense, liters: '48 L' })))
  const [expenseList, setExpenseList] = useState(expenses)

  useEffect(() => {
    let ignore = false

    Promise.allSettled([getFuelLogs(), getExpenses()]).then(([fuelResult, expensesResult]) => {
      if (ignore) return

      if (fuelResult.status === 'fulfilled' && Array.isArray(fuelResult.value) && fuelResult.value.length) {
        setFuelLogs(fuelResult.value.map(mapFuelLog))
      }
      if (expensesResult.status === 'fulfilled' && Array.isArray(expensesResult.value) && expensesResult.value.length) {
        setExpenseList(expensesResult.value.map(mapExpense))
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  const totalCost = useMemo(() => {
    const parseAmount = (value) => Number(String(value).replace(/[^0-9.-]+/g, '')) || 0
    return [...fuelLogs, ...expenseList].reduce((sum, item) => sum + parseAmount(item.amount), 0)
  }, [expenseList, fuelLogs])

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-title">
          <h3>FUEL & EXPENSES</h3>
          <div className="section-actions">
            <button className="btn btn-secondary">ADD FUEL LOG</button>
            <button className="btn btn-primary">ADD EXPENSE</button>
          </div>
        </div>
        <div className="fuel-layout">
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Fuel log</h3>
              <span className="muted">Recent entries</span>
            </div>
            <div className="table-card">
              <div className="table-row table-head">
                <div>Vehicle</div>
                <div>Date</div>
                <div>Litres</div>
                <div>Fuel cost</div>
              </div>
              {fuelLogs.map((expense) => (
                <div key={expense.id} className="table-row">
                  <div>{expense.vehicle}</div>
                  <div>{expense.date}</div>
                  <div>{expense.liters || '48 L'}</div>
                  <div>{expense.amount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel soft-panel">
            <div className="section-title">
              <h3>Other expenses</h3>
              <span className="muted">Tolls & misc.</span>
            </div>
            <div className="table-card">
              <div className="table-row table-head">
                <div>Trips</div>
                <div>Vehicles</div>
                <div>Type</div>
                <div>Total</div>
              </div>
              {expenseList.map((expense) => (
                <div key={expense.id} className="table-row">
                  <div>{expense.id}</div>
                  <div>{expense.vehicle}</div>
                  <div>{expense.category}</div>
                  <div>{expense.amount}</div>
                </div>
              ))}
            </div>
            <div className="summary-card" style={{ marginTop: '10px' }}>
              <h4>TOTAL OPERATIONAL COST</h4>
              <p className="muted">Fuel + expenses = Rs {totalCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FuelExpenses
