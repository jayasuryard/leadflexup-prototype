import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Globe, Users, Star, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { competitorDatabase } from '../data/mockDatabase';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const CompetitorLeaderboard = () => {
  const { language, businessData, analyticsData } = useApp();

  if (!businessData || !analyticsData) return null;

  const competitors = competitorDatabase[businessData.category] || [];
  const userScore = analyticsData.digitalPresence.overall;
  
  // Add user business to leaderboard
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('competitorLeaderboard', language)}
        </h1>
        <p className="text-gray-600">
          See how you stack up against competitors in your market
        </p>
      </div>

      {/* User Position Highlight */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardBody className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <p className="text-indigo-100 text-sm mb-1">{t('yourPosition', language)}</p>
              <p className="text-5xl font-bold">#{userPosition}</p>
              <p className="text-indigo-100 text-sm mt-2">out of {leaderboard.length} competitors</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <p className="text-indigo-100 text-sm mb-1">Overall Score</p>
              <p className="text-5xl font-bold">{userScore}</p>
              <p className="text-indigo-100 text-sm mt-2">Digital presence rating</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <p className="text-indigo-100 text-sm mb-1">Improvement Potential</p>
              <p className="text-5xl font-bold">+{95 - userScore}</p>
              <p className="text-indigo-100 text-sm mt-2">Points to market leader</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-900">Market Rankings</h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Social
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Monthly Visits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      item.isUser 
                        ? 'bg-indigo-50 hover:bg-indigo-100' 
                        : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                        {index === 2 && <Trophy className="w-5 h-5 text-orange-600" />}
                        <span className="font-bold text-gray-900">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${item.isUser ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {item.name}
                        </span>
                        {item.isUser && <Badge variant="primary">You</Badge>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 min-w-[2rem]">{item.score}</span>
                        <ProgressBar value={item.score} showLabel={false} className="w-24" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={item.website ? 'success' : 'danger'}>
                        {item.website ? 'Active' : 'None'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < item.socialMedia 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium">{item.reviews}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium">{item.monthlyVisits.toLocaleString()}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Competitive Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <Globe className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Website Advantage</h3>
            <p className="text-sm text-gray-600">
              {competitors.filter(c => c.website).length} out of {competitors.length} competitors have active websites
            </p>
            <div className="mt-4">
              <ProgressBar 
                value={(competitors.filter(c => c.website).length / competitors.length) * 100}
                color="indigo"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Users className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Social Media Gap</h3>
            <p className="text-sm text-gray-600">
              Average competitor has {(competitors.reduce((acc, c) => acc + c.socialMedia, 0) / competitors.length).toFixed(1)} platforms
            </p>
            <div className="mt-4">
              <ProgressBar 
                value={(competitors.reduce((acc, c) => acc + c.socialMedia, 0) / competitors.length / 4) * 100}
                color="purple"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Star className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Review Leadership</h3>
            <p className="text-sm text-gray-600">
              Top competitor has {Math.max(...competitors.map(c => c.reviews))} reviews
            </p>
            <div className="mt-4">
              <ProgressBar 
                value={(userEntry.reviews / Math.max(...competitors.map(c => c.reviews))) * 100}
                color="yellow"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
