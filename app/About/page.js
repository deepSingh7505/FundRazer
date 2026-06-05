import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#00091D] text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <section className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FundRazer</h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            FundRazer is a creator support platform where fans and friends can support creators
            through simple donations. The goal of this website is to make it easier for creators
            to receive appreciation, funding, and encouragement for the work they do.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">What this website does</h2>
            <p className="text-slate-300 mb-4">
              This platform allows creators to build their presence and receive support directly
              from their audience. It is designed to be simple, fast, and useful for both
              creators and supporters.
            </p>
            <ul className="space-y-3 text-slate-200">
              <li>Support creators with direct donations.</li>
              <li>Track donations and creator activity.</li>
              <li>Give creators a dedicated page for their audience.</li>
              <li>Build a cleaner connection between creators and supporters.</li>
            </ul>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Why FundRazer exists</h2>
            <p className="text-slate-300 mb-4">
              Many creators need a simple way to receive support without unnecessary complexity.
              FundRazer was built as a modern creator-focused website where support feels direct,
              personal, and easy to use.
            </p>
            <p className="text-slate-300">
              The project also represents a practical full-stack learning build using modern web
              development tools and real-world features like authentication, payments, and database integration.
            </p>
          </div>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-lg mb-10">
          <h2 className="text-3xl font-bold mb-4 text-center">About the Creator</h2>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-3 text-purple-400">Deep Singh</h3>

            <p className="text-slate-300 mb-4">
              Hi, I’m Deep Singh, the creator of FundRazer. I built this project as part of my
              journey in web development and full-stack application building.
            </p>

            <p className="text-slate-300 mb-4">
              This website reflects my interest in creating useful platforms with modern
              technologies such as Next.js, React, authentication systems, database integration,
              and payment workflows.
            </p>

            <p className="text-slate-300">
              My goal with this project is not only to build a functional crowdfunding platform
              for creators, but also to improve my skills by working on a real-world product.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://instagram.com/deepsingh_7505"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 px-5 py-2 rounded-xl font-medium"
              >
                Instagram
              </a>

              <a
                href="https://github.com/deepsingh7505"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-gray-950 px-5 py-2 rounded-xl font-medium"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com/in/deepsingh7505"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-medium"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-3">Explore the platform</h2>
          <p className="text-slate-400 mb-6">
            Visit creators, support their work, and explore how FundRazer is built.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <Link
              href="/"
              className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-medium"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
export const metadata = {
  title: "About | FundRazer",
  description: "Learn about FundRazer and Deep Singh, the creator of the platform.",
}