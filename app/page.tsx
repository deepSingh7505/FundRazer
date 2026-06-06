import Image from "next/image"
import Link from "next/link"

const features = [
  {
    title: "Focus on your work",
    description: "Spend more time creating and less time worrying about how to collect support.",
    image: "/man.gif",
    alt: "Creator focusing on project work",
  },
  {
    title: "Receive direct funding",
    description: "Let your friends, fans, and supporters help fund your ideas and projects.",
    image: "/coin.gif",
    alt: "Funding and donations illustration",
  },
  {
    title: "Build your community",
    description: "Grow stronger connections with people who believe in your work and want to support it.",
    image: "/group.gif",
    alt: "Community support illustration",
  },
]

export default function Home() {
  return (
    <main className="text-white">
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center py-16 text-center sm:min-h-[78vh]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm text-slate-200 backdrop-blur-sm">
            Support creators in a simple way
          </div>

          <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
             Fund Razer
            </h1>
            <Image
              src="/tea.gif"
              alt="Animated tea cup"
              width={96}
              height={96}
              priority
              className="drop-shadow-lg"
            />
          </div>

          <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-lg md:text-xl">
            A crowdfunding platform for creators to receive support from friends and fans.
            Start your journey, build your profile, and turn appreciation into real support.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/Login"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-[1.02] hover:from-purple-500 hover:to-blue-400 sm:w-auto sm:text-base"
            >
              Start Now
            </Link>

            <Link
              href="/About"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto sm:text-base"
            >
              Read More
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Easy</p>
              <p className="mt-1 text-sm text-slate-300">Simple support flow for creators and fans.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Fast</p>
              <p className="mt-1 text-sm text-slate-300">Built for smooth donations and profile management.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Direct</p>
              <p className="mt-1 text-sm text-slate-300">Support goes straight to the creator experience.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto h-px w-[92%] max-w-6xl bg-white/10" />

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Why creators Use FundRazer
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Everything is designed to help creators stay focused, receive support, and grow their connection with supporters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg transition hover:-translate-y-1 hover:border-purple-400/30 hover:bg-slate-800/70"
              >
                <div className="mb-5 flex justify-center">
                  <div className="rounded-full bg-slate-700 p-3 transition group-hover:bg-slate-600">
                    <Image
                      src={feature.image}
                      alt={feature.alt}
                      width={80}
                      height={80}
                    />
                  </div>
                </div>

                <h3 className="text-center text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-center text-sm leading-6 text-slate-400 sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto h-px w-[92%] max-w-6xl bg-white/10" />

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
              Learning journey
            </p>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Built with guidance from Code With Harry
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              This project was inspired and guided by a YouTube tutorial. It helped shape the learning process behind building a real creator-funding platform with modern web technologies.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="https://www.youtube.com/@CodeWithHarry"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-blue-400 sm:text-base"
              >
                Visit Channel
              </a>

              <Link
                href="/About"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
              >
                Learn more about this project
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/QtaorVNAwbI?si=hdz-eb7YXqMy1GJo"
                title="Code With Harry tutorial video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto h-px w-[92%] max-w-6xl bg-white/10" />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center shadow-xl sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Ready to support or get supported?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Join FundRazer and create a space where your work can be appreciated and funded by the people who care about it.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/Login"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-blue-400 sm:text-base"
            >
              Get Started
            </Link>

            <Link
              href="/deepsingh75053"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
            >
             Support Deep
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
export const metadata = {
  title: "FundRazer | Support creators you love",
  description: "A crowdfunding platform where fans and friends support creators directly.",
}