export const OutboundHookPlugin = async () => {
  const ntfyUrl = process.env.NTFY_HOOK_URL

  const notify = async (text) => {
    if (!ntfyUrl) return
    try {
      await fetch(ntfyUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text,
      })
    } catch (err) {
      console.error("outbound-hook:", err)
    }
  }

  return {
    "tool.execute.before": async (input) => {
      await notify(`opencode: ${input.tool}`)
    },
  }
}
