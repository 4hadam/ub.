export interface Channel {
  name: string
  logo?: string
  url: string
  group?: string
}

export async function parseM3U(m3uContent: string): Promise<Channel[]> {
  const lines = m3uContent.split("\n")
  const channels: Channel[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith("#EXTINF:")) {
      const nextLine = lines[i + 1]?.trim()
      if (!nextLine || nextLine.startsWith("#")) continue

      // Parse channel info from EXTINF line
      const nameMatch = line.match(/,(.+)$/)
      const logoMatch = line.match(/tvg-logo="([^"]+)"/)
      const groupMatch = line.match(/group-title="([^"]+)"/)

      const channel: Channel = {
        name: nameMatch ? nameMatch[1].trim() : "Unknown",
        url: nextLine,
        logo: logoMatch ? logoMatch[1] : undefined,
        group: groupMatch ? groupMatch[1] : undefined,
      }

      channels.push(channel)
      i++ // Skip the URL line
    }
  }

  return channels
}

export async function fetchChannelsByCountry(countryCode: string): Promise<Channel[]> {
  try {
    const url = `https://iptv-org.github.io/iptv/countries/${countryCode.toLowerCase()}.m3u`
    const response = await fetch(url)

    if (!response.ok) {
      console.warn(`[v0] Failed to fetch channels for ${countryCode}`)
      return []
    }

    const content = await response.text()
    return parseM3U(content)
  } catch (error) {
    console.error(`[v0] Error fetching IPTV channels for ${countryCode}:`, error)
    return []
  }
}
