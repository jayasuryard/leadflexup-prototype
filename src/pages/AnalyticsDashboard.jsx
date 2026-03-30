import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Globe, Users, Star, MapPin,
  Eye, MousePointer, Share2, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { CircularProgress, ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';

export const AnalyticsDashboard = () => {
  const { analyticsData, language, businessData } = useApp();

  if (!analyticsData) return null;

  const { digitalPresence, traffic, socialMedia, geoInsights } = analyticsData;

  const StatCard = ({ icon: Icon, label, value, change, trend }) => (
    <Card hover>
      <CardBody className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('analytics', language)}
        </h1>
        <p className="text-gray-600">
          Complete overview of {businessData?.businessName}'s digital performance
        </p>
      </div>

      {/* Digital Presence Score - Hero Card */}
      <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <CardBody className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('digitalPresence', language)}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-indigo-100 text-sm mb-1">{t('websiteHealth', language)}</p>
                  <ProgressBar 
                    value={digitalPresence.website} 
                    showLabel={true} 
                    className="[&_.bg-gray-200]:bg-white/20 [&_.bg-indigo-600]:bg-white"
                  />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm mb-1">{t('socialMediaScore', language)}</p>
                  <ProgressBar 
                    value={digitalPresence.socialMedia} 
                    showLabel={true}
                    className="[&_.bg-gray-200]:bg-white/20 [&_.bg-indigo-600]:bg-white"
                  />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm mb-1">{t('searchVisibility', language)}</p>
                  <ProgressBar 
                    value={digitalPresence.searchVisibility} 
                    showLabel={true}
                    className="[&_.bg-gray-200]:bg-white/20 [&_.bg-indigo-600]:bg-white"
                  />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm mb-1">{t('onlineReviews', language)}</p>
                  <ProgressBar 
                    value={digitalPresence.onlineReviews} 
                    showLabel={true}
                    className="[&_.bg-gray-200]:bg-white/20 [&_.bg-indigo-600]:bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <CircularProgress 
                value={digitalPresence.overall} 
                size={180}
                strokeWidth={12}
                className="[&_circle]:stroke-white/20 [&_motion\\.circle]:!stroke-white [&_span]:text-white"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard 
          icon={Eye}
          label={t('monthlyVisits', language)}
          value={traffic.monthly[traffic.monthly.length - 1]?.visits}
          change="+24%"
          trend="up"
        />
        <StatCard 
          icon={MousePointer}
          label={t('leadsGenerated', language)}
          value={traffic.monthly[traffic.monthly.length - 1]?.leads}
          change="+38%"
          trend="up"
        />
        <StatCard 
          icon={Users}
          label="Total Followers"
          value={socialMedia.platforms.reduce((acc, p) => acc + p.followers, 0).toLocaleString()}
          change="+16%"
          trend="up"
        />
        <StatCard 
          icon={Star}
          label="Avg. Engagement"
          value={`${(socialMedia.platforms.reduce((acc, p) => acc + p.engagement, 0) / socialMedia.platforms.length).toFixed(1)}%`}
          change="+12%"
          trend="up"
        />
      </div>

      {/* Traffic Trends */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Traffic & Lead Trends</h3>
              <Badge variant="success">+24% vs last month</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={traffic.monthly}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="visits" stroke="#6366f1" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2} />
                <Area type="monotone" dataKey="leads" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">{t('trafficSources', language)}</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={traffic.sources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {traffic.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {traffic.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-gray-700">{source.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Social Media Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">Social Media Performance</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {socialMedia.platforms.map((platform, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{platform.name}</p>
                      <p className="text-sm text-gray-600">{platform.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{platform.engagement}%</p>
                    <p className="text-sm text-gray-600">engagement</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">{t('geoInsights', language)}</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={geoInsights.topCities} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="city" type="category" stroke="#6b7280" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="percentage" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
