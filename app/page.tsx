"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import GlobeViewer from "@/components/globe-viewer"
import CountrySidebar from "@/components/country-sidebar"
import CountryDetail from "@/components/country-detail"

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Globe Viewer or Video Player */}
        <div className="flex-1 relative">
          {selectedCountry && selectedChannel ? (
            <CountryDetail
              country={selectedCountry}
              channel={selectedChannel}
              onBack={() => {
                setSelectedChannel(null)
              }}
            />
          ) : (
            <GlobeViewer selectedCountry={selectedCountry} />
          )}
        </div>

        {/* Country Sidebar */}
        <CountrySidebar
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          onSelectChannel={setSelectedChannel}
        />
      </div>
    </div>
  )
}
