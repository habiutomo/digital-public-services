import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white p-4 text-center text-gray-500 text-sm border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>© {currentYear} {t("footer.copyright")}</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/help">
              <a className="hover:text-primary-600">{t("footer.help")}</a>
            </Link>
            <Link href="/privacy-policy">
              <a className="hover:text-primary-600">{t("footer.privacy_policy")}</a>
            </Link>
            <Link href="/terms">
              <a className="hover:text-primary-600">{t("footer.terms")}</a>
            </Link>
            <Link href="/contact">
              <a className="hover:text-primary-600">{t("footer.contact")}</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
