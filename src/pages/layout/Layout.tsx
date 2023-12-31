import { Outlet, NavLink, Link } from "react-router-dom";

import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { useBoolean } from '@fluentui/react-hooks';

import styles from "./Layout.module.css";

import logo from "../../assets/SSC-Logo-Purple-Leaf-300x300.png";
import { useTranslation } from 'react-i18next';
import { DefaultPalette, IStackTokens, Stack } from "@fluentui/react";

import Cookies from "js-cookie";

const Layout = () => {

    const { t, i18n } = useTranslation();

    const setDisclaimerCookie = () => {
        Cookies.set("read_disclaimer", "true", {
            expires: 30,
        });
    };

    const setTranslationCookie = () => {
        Cookies.set("lang_setting", i18n.language, {
            expires: 30,
        });
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const modalPropsStyles = { main: { maxWidth: 600 } };
    const dialogContentProps = {
        type: DialogType.normal,
        title: t("disclaimer"),
        closeButtonAriaLabel: t("close"),
        };

    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);

    const modalProps = React.useMemo(
        () => ({
            isBlocking: true,
            styles: modalPropsStyles,
        }),
        [false]
    );

    return (
        <div className={styles.layout}>
            {Cookies.get("read_disclaimer") != "true" &&
                <Dialog hidden={hideDialog} onDismiss={toggleHideDialog} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                    <p>{t("disclaimer.desc")}</p>
                    <p className={styles.disclaimer}>{t("disclaimer.desc2")}</p>
                    <DialogFooter>
                        <PrimaryButton onClick={() => {toggleHideDialog(); setDisclaimerCookie();}} text={t("close")} />
                        <DefaultButton onClick={() => {changeLanguage(t("langlink.shorthand")); setTranslationCookie();}} text={t("langlink")} />
                    </DialogFooter>
                </Dialog>
            }
            <header id="main-menu" className={styles.header} role={"banner"}>
                <nav aria-labelledby="main-menu">
                    <div className={styles.headerContainer}>
                        <Link to="." className={styles.headerTitleContainer} title="Azure OpenAI + Llama_index + langchain">
                            <img
                                src={logo}
                                alt="Shared Services Canada Logo"
                                width="32px"
                                height="32px"
                            />
                            <h3 className={styles.headerTitle}>{t("title")}</h3>
                        </Link>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    {t("sscplus.question")}
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/any" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                {t("any.question")}
                                </NavLink>
                            </li>
                        </ul>
                        <a className={styles.headerNavLang} href="#" style={{color:'white'}} onClick={(event) => {event.preventDefault(); changeLanguage(t("langlink.shorthand")); setTranslationCookie();}}>{t("langlink")}</a>
                    </div>
                </nav>
            </header>

            <Outlet />

            <footer id="footer-navigation" className={styles.footer} aria-label={t("footer.desc")}>
                <nav aria-labelledby="footer-navigation">
                    <div className={styles.footerContainer}>
                        <ul className={styles.footerNavList}>
                            <li><a className={styles.footerNavPageLink} href={t("msteams.channel.url")} target="_blank">{t("msteams.channel")}</a></li>
                            <li className={styles.headerNavLeftMargin}><a className={styles.footerNavPageLink} href={t("tbs.responsibleai.url")} target="_blank">{t("tbs.responsibleai")}</a></li>
                            <li className={styles.headerNavLeftMargin}><a className={styles.footerNavPageLink} href={t("feedback.url")} target="_blank">{t("feedback")}</a></li>
                        </ul>
                    </div>
                </nav>
            </footer>
        </div>
    );
};

export default Layout;
