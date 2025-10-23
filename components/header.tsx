"use client"

import { Menu, Search, Share2 } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-slate-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-lime-400 text-black font-bold px-2 py-1 rounded text-sm">TV</div>
            <span className="text-white font-semibold">garden</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
