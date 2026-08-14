import React from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "./Hero";
import { MiniSwipper } from "./MiniSwipper";
import { Reasons } from "./Reasons";
import { Blogs } from "./Blogs";
import { Text } from "./Text";
import { Contact } from "./Contact";
import { Newslatter } from "./Newslatter";
import { Footer } from "./Footer";
import { Testimony } from "./Testimony";

const FeaturesHighlight = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-[0.8rem] font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Innovation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            More Than Just a Bookstore
          </h2>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            BookBay combines smart technology with gamification to make your reading journey engaging and rewarding.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Assistant */}
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤖</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AI Book Assistant</h3>
                <p className="text-indigo-200 text-[0.9rem] leading-relaxed mb-4">
                  Chat with our AI to get personalized book recommendations, summaries, and reading suggestions. Ask anything about books — our assistant knows it all.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Book Search", "Summaries", "Recommendations", "Reading Tips"].map((tag) => (
                    <span key={tag} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-[0.75rem] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/ai")}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold transition"
                >
                  Try AI Assistant
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* AI preview mockup */}
            <div className="mt-6 bg-slate-900/50 rounded-xl border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-[0.7rem] text-slate-400">BookBay AI Chat</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white text-[0.8rem] px-3 py-2 rounded-xl rounded-br-sm max-w-[70%]">
                    Recommend me a fiction book
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white text-[0.8rem] px-3 py-2 rounded-xl rounded-bl-sm max-w-[80%]">
                    Here are some great fiction books you might enjoy:
                    <br />📚 Things Fall Apart by Chinua Achebe
                    <br />📚 The Alchemist by Paulo Coelho
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification */}
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start gap-5">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🏆</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Achievements & Rewards</h3>
                <p className="text-indigo-200 text-[0.9rem] leading-relaxed mb-4">
                  Earn points for every activity, build daily reading streaks, unlock badges, and climb the leaderboard. Turn reading into a rewarding game.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Points System", "Daily Streaks", "Badges", "Leaderboard"].map((tag) => (
                    <span key={tag} className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-[0.75rem] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/gamification")}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold transition"
                >
                  View Achievements
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Gamification preview mockup */}
            <div className="mt-6 bg-slate-900/50 rounded-xl border border-white/5 p-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-amber-500/10 rounded-lg p-3 text-center">
                  <span className="text-xl">🔥</span>
                  <p className="text-white font-bold text-lg mt-1">7</p>
                  <p className="text-amber-300 text-[0.65rem]">Day Streak</p>
                </div>
                <div className="bg-indigo-500/10 rounded-lg p-3 text-center">
                  <span className="text-xl">⭐</span>
                  <p className="text-white font-bold text-lg mt-1">150</p>
                  <p className="text-indigo-300 text-[0.65rem]">Points</p>
                </div>
                <div className="bg-emerald-500/10 rounded-lg p-3 text-center">
                  <span className="text-xl">🏅</span>
                  <p className="text-white font-bold text-lg mt-1">5</p>
                  <p className="text-emerald-300 text-[0.65rem]">Badges</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-1">
                  {["🎉", "🐛", "⭐", "🔥", "💎"].map((icon, i) => (
                    <span key={i} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[0.7rem]">
                      {icon}
                    </span>
                  ))}
                </div>
                <span className="text-[0.7rem] text-slate-400">+ 7 more badges to unlock</span>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 text-center">
          <p className="text-[0.85rem] text-indigo-300 font-medium mb-2">How It Works</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {[
              { step: "1", icon: "📖", text: "Browse & buy books" },
              { step: "2", icon: "🤖", text: "Chat with AI for tips" },
              { step: "3", icon: "🏆", text: "Earn points & badges" },
            ].map((item, i) => (
              <React.Fragment key={item.step}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[0.8rem] font-bold">
                    {item.step}
                  </span>
                  <span className="text-white text-[0.9rem]">{item.icon} {item.text}</span>
                </div>
                {i < 2 && <span className="text-indigo-500 text-lg hidden sm:block">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Home = () => {
  
  return (
    <div className="body relative min-h-[100vh] w-full overflow-x-hidden">
      <Hero
        className="border-2 border-red-500" />
      <Text
        head="Books Categories"
        body="Discover Diverse Genres: Your Journey Through a World of Book Categories"
      />
      <MiniSwipper />
      <FeaturesHighlight />
      <Reasons />
      <Testimony />
      <Blogs />
      <Contact />
      <Newslatter />
      <Footer />
    </div>
  );
};
