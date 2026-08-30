// Client-side integrity/telemetry collector for the code assessment.
//
// SOFT / record-only: it silently observes tab-switching, focus loss, paste/copy,
// and time-on-task, then hands a snapshot to the submit request. It never blocks or
// interrupts the candidate. These are deterrence + review signals, not prevention —
// all of it is bypassable (second device, disabled JS). Server-side scoring lives in
// the /api/submit route; nothing here is trusted for a verdict on its own.

export interface ProctoringSnapshot {
  startedAt: number          // epoch ms when the editor mounted
  submittedAt: number        // epoch ms at submit
  durationMs: number         // submittedAt - startedAt
  tabSwitches: number        // times the tab became hidden
  focusLossCount: number     // times the window lost focus
  focusLossMs: number        // total ms spent with the window blurred/hidden
  pasteCount: number         // number of paste events into the editor
  pastedChars: number        // total characters pasted
  largestPaste: number       // largest single paste (chars)
  copyCount: number          // number of copy events from the editor
}

export class ProctoringCollector {
  private startedAt = Date.now()
  private tabSwitches = 0
  private focusLossCount = 0
  private focusLossMs = 0
  private pasteCount = 0
  private pastedChars = 0
  private largestPaste = 0
  private copyCount = 0

  private awayAt: number | null = null
  private onVisibility = () => {
    if (typeof document === 'undefined') return
    if (document.hidden) {
      this.tabSwitches += 1
      if (this.awayAt === null) this.awayAt = Date.now()
    } else {
      this.resumeFromAway()
    }
  }
  private onBlur = () => {
    this.focusLossCount += 1
    if (this.awayAt === null) this.awayAt = Date.now()
  }
  private onFocus = () => this.resumeFromAway()

  private resumeFromAway() {
    if (this.awayAt !== null) {
      this.focusLossMs += Date.now() - this.awayAt
      this.awayAt = null
    }
  }

  /** Attach window/document listeners. Safe to call only in the browser. */
  start() {
    if (typeof window === 'undefined') return
    document.addEventListener('visibilitychange', this.onVisibility)
    window.addEventListener('blur', this.onBlur)
    window.addEventListener('focus', this.onFocus)
  }

  /** Remove listeners (call on unmount). */
  dispose() {
    if (typeof window === 'undefined') return
    document.removeEventListener('visibilitychange', this.onVisibility)
    window.removeEventListener('blur', this.onBlur)
    window.removeEventListener('focus', this.onFocus)
  }

  recordPaste(chars: number) {
    this.pasteCount += 1
    this.pastedChars += chars
    if (chars > this.largestPaste) this.largestPaste = chars
  }

  recordCopy() {
    this.copyCount += 1
  }

  snapshot(): ProctoringSnapshot {
    // settle any in-progress away period so focusLossMs is current
    this.resumeFromAway()
    const submittedAt = Date.now()
    return {
      startedAt: this.startedAt,
      submittedAt,
      durationMs: submittedAt - this.startedAt,
      tabSwitches: this.tabSwitches,
      focusLossCount: this.focusLossCount,
      focusLossMs: this.focusLossMs,
      pasteCount: this.pasteCount,
      pastedChars: this.pastedChars,
      largestPaste: this.largestPaste,
      copyCount: this.copyCount,
    }
  }
}
