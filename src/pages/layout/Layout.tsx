import { Outlet, NavLink, Link } from "react-router-dom";

import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { Toggle } from '@fluentui/react/lib/Toggle';

import github from "../../assets/github.svg";

import styles from "./Layout.module.css";

import logo from "../../assets/SSC-Logo-Purple-Leaf-300x300.png";
import { useTranslation } from 'react-i18next';

import Cookies from "js-cookie";

const Layout = () => {

    const SetCookie = () => {
        Cookies.set("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", {
          expires: 7,
        });
      };

    
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const modalPropsStyles = { main: { maxWidth: 450 } };
    const dialogContentProps = {
        type: DialogType.normal,
        title: t("disclaimer"),
        closeButtonAriaLabel: "Close",
        subText: t("disclaimer.desc"),
      };
    
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

    const modalProps = React.useMemo(
        () => ({
          isBlocking: true,
          styles: modalPropsStyles,
        }),
        [false]
        );
    return (
        <div className={styles.layout}>
            <Dialog  hidden={!hideDialog} onDismiss={toggleHideDialog} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <DialogFooter>
                    <PrimaryButton onClick={toggleHideDialog} text={t("close")} />
                </DialogFooter>
            </Dialog>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="https://plus.ssc-spc.gc.ca/en" className={styles.headerTitleContainer} title="SSC Plus">
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
                    <a href="https://forms.office.com/r/dPvsZykMSy" target="_blank" className={styles.footerText}><h4>{t('feedback')}</h4></a>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
