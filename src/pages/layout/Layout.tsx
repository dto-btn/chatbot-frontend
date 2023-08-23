import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/github.svg";

import styles from "./Layout.module.css";

import logo from "../../assets/SSC-Logo-Purple-Leaf-300x300.png";
import { useTranslation } from 'react-i18next';

const Layout = () => {

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="." className={styles.headerTitleContainer}>
                        <img
                            src={logo}
                            alt="Shared Services Canada Logo"
                            aria-label="Link to SSC Plus"
                            width="32px"
                            height="32px"
                        />
                        <h3 className={styles.headerTitle}>{t("title")}</h3>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            {/* <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li> */}
                            {/* <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/qa" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Ask a question
                                </NavLink>
                            </li> */}
                            <li><a href="#" style={{color:'white'}} onClick={() => changeLanguage(t("langlink.shorthand"))}>{t("langlink")}</a></li>
                            <li className={styles.headerNavLeftMargin}>
                                <a href="https://github.com/dto-btn/chatbot-frontend" target={"_blank"} title={t("githublnk")}>
                                    <img
                                        src={github}
                                        alt="Github logo"
                                        aria-label={t("githublnk")}
                                        width="20px"
                                        height="20px"
                                        className={styles.githubLogo}
                                    />
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <h4 className={styles.headerRightText}>Azure OpenAI + Llama_index + langchain</h4>
                </div>
            </header>

            <Outlet />

            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <a href={t('feedback.url')} target="_blank" className={styles.footerText}><h3>{t('feedback.long')}</h3></a>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
