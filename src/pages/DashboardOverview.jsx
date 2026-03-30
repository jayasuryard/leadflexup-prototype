import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Target, Lightbulb, ArrowRight,
  BarChart3, Trophy, Rocket
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/ProgressBar';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData, recommendations, subscription } = useApp();

  if (!analyticsData) return null;

  const quickStats = [
    { 
      label: 'Monthly Visits', 
      value: analyticsData.traffic.monthly[analyticsData.traffic.monthly.length - 1]?.visits,
      change: '+24%',
      icon: TrendingUp,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    { 
      label: 'Leads Generated', 
      value: analyticsData.traffic.monthly[analyticsData.traffic.monthly.length - 1]?.leads,
      change: '+38%',
      icon: Target,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    { 
      label: 'Social Followers', 
      value: analyticsData.socialMedia.platforms.reduce((acc, p) => acc + p.followers, 0).toLocaleString(),
      change: '+16%',
      icon: Users,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {businessData?.businessName}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-semibold text-green-600 mt-2">{stat.change}</p>
                </div>
                <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Digital Presence Score */}
        <Card className="lg:col-span-2">
          <CardBody className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Digital Presence Score
                </h2>
                <p className="text-gray-600">Your overall market performance</p>
              </div>
              <CircularProgress value={analyticsData.digitalPresence.overall} size={140} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Website Health</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.digitalPresence.website}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Social Media</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.digitalPresence.socialMedia}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Search Visibility</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.digitalPresence.searchVisibility}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Online Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.digitalPresence.onlineReviews}</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => navigate('/dashboard/analytics')}
              icon={ArrowRight}
            >
              View Detailed Analytics
            </Button>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <CardBody className="p-6">
              <Rocket className="w-10 h-10 mb-4" />
              <h3 className="text-lg font-bold mb-2">Growth Journey</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Continue your path to 4x revenue growth
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/dashboard/journey')}
              >
                Continue Journey
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <Trophy className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Competitor Ranking
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                See how you compare to competitors
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/competitors')}
              >
                View Leaderboard
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recommendations Preview */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Smart Recommendations
                  </h2>
                  <p className="text-sm text-gray-600">
                    AI-powered insights for your business
                  </p>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/recommendations')}
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/dashboard/recommendations')}
                >
                  <Badge variant={rec.priority}>{rec.priority}</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {rec.title.en}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {rec.impact} • {rec.timeline}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Subscription CTA */}
      {!subscription && (
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardBody className="p-8 text-center">
            <BarChart3 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Unlock Your Full Growth Potential
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Subscribe to access automated marketing campaigns, advanced analytics, 
              and our AI-powered lead generation system.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/dashboard/subscription')}
            >
              View Subscription Plans
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
