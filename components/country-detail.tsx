"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, X } from "lucide-react"
import { getChannelsByCountry } from "@/lib/youtube-channels"

interface CountryDetailProps {
  country: string
  channel: string
  onBack: () => void
}

export default function CountryDetail({ country, channel, onBack }: CountryDetailProps) {
  const [youtubeId, setYoutubeId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    setLoading(true)
    setError("")

    const channels = getChannelsByCountry(country)
    const selectedChannel = channels.find((c) => c.name === channel)

    if (selectedChannel) {
      setYoutubeId(selectedChannel.youtubeId)
    } else {
      setError("Channel not found in database")
    }
    setLoading(false)
  }, [country, channel])

  const youtubeUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1` : ""

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      {/* Video Player Window */}
      <div className="w-full max-w-4xl mx-auto px-8">
        <div className="bg-slate-900 rounded-lg overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded transition-colors">
                <ChevronLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white">{country}</h2>
                <p className="text-sm text-slate-400">{channel}</p>
              </div>
            </div>
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Video Player */}
          <div className="bg-black aspect-video flex items-center justify-center relative">
            {loading ? (
              <div className="text-center">
                <div className="text-slate-500 mb-4">Loading stream...</div>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="text-red-400 mb-4">Error</div>
                <p className="text-sm text-slate-600">{error}</p>
              </div>
            ) : youtubeUrl ? (
              <iframe
                key={youtubeUrl}
                className="w-full h-full"
                src={youtubeUrl}
                title={channel}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center">
                <div className="text-slate-500 mb-4">Stream not available</div>
                <p className="text-sm text-slate-600">This channel stream is not currently available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-800 px-6 py-3 flex items-center justify-between text-sm text-slate-400">
            <div>LIVE</div>
            <div>{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
