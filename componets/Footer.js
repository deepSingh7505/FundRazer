import React from "react"

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-4 border-t border-white/10 flex ">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-300">
        © {new Date().getFullYear()} FundRazer || Built by Deep Singh
      </div>
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-300">
        Contect : deepsingh75053@gmail.com
      </div>
    </footer>
  )
}

export default Footer