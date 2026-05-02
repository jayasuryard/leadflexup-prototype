import { TrendingUp } from 'lucide-react';
import { t } from '../../utils/i18n';
import { Commentable } from '../../components/CommentBox';

export const Footer = ({ language, changeLanguage }) => {
  return (
    <footer className="py-12 border-t border-navy-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <Commentable id="footer-logo" label="Footer Logo Area">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-navy-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
              </div>
              <p className="text-xs text-navy-400 leading-relaxed">{t('lpFooterTagline', language)}</p>
            </div>
          </Commentable>
          <Commentable id="footer-product-links" label="Footer Product Links">
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterProduct', language)}</h4>
              <div className="space-y-2">
                {[t('analytics', language), t('automationHub', language), t('contentStudio', language), t('websiteBuilder', language), t('leadManager', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>
          </Commentable>
          <Commentable id="footer-company-links" label="Footer Company Links">
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterCompany', language)}</h4>
              <div className="space-y-2">
                {[t('lpFooterAbout', language), t('lpFooterBlog', language), t('lpFooterCareers', language), t('lpFooterContact', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>
          </Commentable>
          <Commentable id="footer-legal-links" label="Footer Legal Links">
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterLegal', language)}</h4>
              <div className="space-y-2">
                {[t('lpFooterPrivacy', language), t('lpFooterTermsLink', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>
          </Commentable>
        </div>
        <Commentable id="footer-copyright" label="Footer Copyright Area">
          <div className="pt-6 border-t border-navy-200/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-navy-400">{t('lpFooterText', language)}</p>
            <select value={language} onChange={(e) => changeLanguage(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-navy-200/50 bg-white/60 text-xs font-medium text-navy-600"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="te">తెలుగు</option>
              <option value="ml">മലయാളം</option>
            </select>
          </div>
        </Commentable>
      </div>
    </footer>
  );
};
