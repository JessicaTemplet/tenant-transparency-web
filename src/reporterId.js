// Reports are anonymous — there's no login (Phase 1 has no user accounts).
// We generate a random UUID once and keep it in localStorage so a reporter
// can be traced/deduped on the backend without any identifying info.
const KEY = 'tt_reporter_id'

export function getReporterId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}
