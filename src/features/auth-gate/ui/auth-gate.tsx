import { useState } from 'react'

import { signInWithPassword } from '@/lib'

// single-password gate: on success, onAuthStateChanged flips the app into the collection
export function AuthGate() {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr(false)
    try {
      await signInWithPassword(pw)
    } catch {
      setErr(true)
      setBusy(false)
    }
  }

  return (
    <div className="gate">
      <form className="gate__box" onSubmit={submit}>
        <h1 className="gate__brand">STRATA</h1>
        <p className="gate__hint">Enter the password to open the collection.</p>
        <input
          autoFocus
          className="gate__input"
          placeholder="password"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        {err ? <p className="gate__err">Wrong password.</p> : null}
        <button className="gate__btn" disabled={busy || !pw} type="submit">
          {busy ? 'checking…' : 'enter'}
        </button>
      </form>
    </div>
  )
}
