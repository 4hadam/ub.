export interface YouTubeChannel {
  name: string
  youtubeId: string
  category?: string
}

export const YOUTUBE_CHANNELS_BY_COUNTRY: Record<string, YouTubeChannel[]> = {
  Morocco: [
    { name: "2M Monde", youtubeId: "x27h4uIy7MU", category: "News" },
    { name: "Al Aoula", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Maroc TV", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  "United States": [
    { name: "CNN", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Fox News", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  "United Kingdom": [
    { name: "BBC News", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Sky News", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  France: [
    { name: "France 24", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "TF1", youtubeId: "qKHWYx-UXGE", category: "General" },
  ],
  Germany: [
    { name: "DW News", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "ARD", youtubeId: "qKHWYx-UXGE", category: "General" },
  ],
  Spain: [
    { name: "RTVE 24h", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "TVE", youtubeId: "qKHWYx-UXGE", category: "General" },
  ],
  Italy: [
    { name: "RAI News", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Rai 1", youtubeId: "qKHWYx-UXGE", category: "General" },
  ],
  Canada: [
    { name: "CBC News", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "CTV News", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  Australia: [
    { name: "ABC News", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Sky News Australia", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  Japan: [
    { name: "NHK World", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "TBS News", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  India: [
    { name: "NDTV", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Times Now", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  Brazil: [
    { name: "Globo News", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Band News", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  Mexico: [
    { name: "Televisa Noticias", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "Azteca Noticias", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
  Argentina: [
    { name: "TN - Todo Noticias", youtubeId: "kfcVrFjqKJE", category: "News" },
    { name: "C5N", youtubeId: "qKHWYx-UXGE", category: "News" },
  ],
}

export function getChannelsByCountry(country: string): YouTubeChannel[] {
  return YOUTUBE_CHANNELS_BY_COUNTRY[country] || []
}
