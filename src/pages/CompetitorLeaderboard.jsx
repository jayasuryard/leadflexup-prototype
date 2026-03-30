import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Globe, Users, Star, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { competitorDatabase } from '../data/mockDatabase';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

export const CompetitorLeaderboard = () => {
  const { language, businessData, analyticsData } = useApp();
  if (!businessData || !analyticsData) return null;

  const competitors = competitorDatabase[businessData.category] || [];
  const userScore = analyticsData.digitalPresence.overall;

  const userEntry = {
    name: businessData.businessName,
    score: userScore,
    website: userScore > 50,
    socialMedia: Math.floor(userScore / 25),
    reviews: Math.floor(userScore * 3),
    monthlyVisits: Math.floor(userScore * 80),
    isUser: true
  };

  const leaderboard = [...competitors, userEntry].sort((a, b) => b.score - a.score);
  const userPosition = leaderboard.findIndex(item => item.isUser) + 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">{t('competitorLeaderboard', language)}</h1>
        <p className="text-sm text-navy-400 mt-0.5">See how you stack up against competitors</p>
      </div>

      {/* Position highlight */}
      <motion.div {...fade()} className="bg-navy-700 text-white rounded-xl p-6">
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <Trophy className="w-8 h-8 mx-auto mb-2 text-teal-400" />
            <p className="text-navy-200 text-xs mb-1">{t('yourPosition', language)}</p>
            <p className="text-4xl font-bold">#{userPosition}</p>
            <p className="text-navy-300 text-xs mt-1">of {leaderboard.length}</p>
          </div>
          <div>
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-teal-400" />
            <p className="text-navy-200 text-xs mb-1">Overall Score</p>
            <p className="text-4xl font-bold">{userScore}</p>
            <p className="text-navy-300 text-xs mt-1">Digital presence</p>
          </div>
          <div>
            <Award className="w-8 h-8 mx-auto mb-2 text-teal-400" />
            <p className="text-navy-200 text-xs mb-1">Improvement Potential</p>
            <p className="text-4xl font-bold">+{95 - userScore}</p>
            <p className="text-navy-300 text-xs mt-1">Points to leader</p>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-navy-100">
          <h3 className="text-sm font-bold text-navy-800">Market Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-50">
              <tr>
                {['Rank', 'Business', 'Score', 'Website', 'Social', 'Reviews', 'Visits'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-navy-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {leaderboard.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={item.isUser ? 'bg-teal-50/50' : 'hover:bg-navy-50/50'}
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {i < 3 && <Trophy className={`w-4 h-4 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-500'}`} />}
                      <span className="text-xs font-bold text-navy-800">#{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${item.isUser ? 'text-teal-700' : 'text-navy-800'}`}>{item.name}</span>
                      {item.isUser && <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">You</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-navy-800 w-6">{item.score}</span>
                      <div className="w-16 bg-navy-100 rounded-full h-1.5">
                        <div className="bg-navy-600 rounded-full h-1.5" style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.website ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'}`}>
                      {item.website ? 'Active' : 'None'}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < item.socialMedia ? 'text-yellow-400 fill-yellow-400' : 'text-navy-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs font-medium text-navy-700">{item.reviews}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs font-medium text-navy-700">{item.monthlyVisits.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Insights */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Globe, title: 'Website Advantage', desc: `${competitors.filter(c => c.website).length}/${competitors.length} competitors have websites`, val: (competitors.filter(c => c.website).length / competitors.length) * 100 },
          { icon: Users, title: 'Social Media Gap', desc: `Avg. competitor: ${(competitors.reduce((a, c) => a + c.socialMedia, 0) / competitors.length).toFixed(1)} platforms`, val: (competitors.reduce((a, c) => a + c.socialMedia, 0) / competitors.length / 4) * 100 },
          { icon: Star, title: 'Review Leadership', desc: `Top competitor: ${Math.max(...competitors.map(c => c.reviews))} reviews`, val: (userEntry.reviews / Math.max(...competitors.map(c => c.reviews))) * 100 }
        ].map((card, i) => (
          <motion.div key={i} {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-5">
            <card.icon className="w-6 h-6 text-navy-600 mb-3" />
            <h4 className="text-sm font-bold text-navy-800 mb-1">{card.title}</h4>
            <p className="text-xs text-navy-400 mb-3">{card.desc}</p>
            <div className="w-full bg-navy-100 rounded-full h-1.5">
              <div className="bg-teal-500 rounded-full h-1.5" style={{ width: `${card.val}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
