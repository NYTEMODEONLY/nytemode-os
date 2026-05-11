import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useFileSystem } from "contexts/fileSystem";
import { useProcesses } from "contexts/process";
import { useSession } from "contexts/session";
import desktopIcons from "public/.index/desktopIcons.json";
import {
  HIGH_PRIORITY_ELEMENT,
  ONE_TIME_PASSIVE_EVENT,
  PACKAGE_DATA,
} from "utils/constants";
import {
  getDpi,
  getExtension,
  getMimeType,
  imageSrc,
  imageSrcs,
  isDynamicIcon,
} from "utils/functions";

const { alias, author, description } = PACKAGE_DATA;

const Metadata: FC = () => {
  const [title, setTitle] = useState("NYTEMODE OS");
  const [favIcon, setFavIcon] = useState("");
  const { readFile } = useFileSystem();
  const [customCursor, setCustomCursor] = useState("");
  const { cursor, foregroundId } = useSession();
  const { processes: { [foregroundId]: process } = {} } = useProcesses();
  const {
    icon: processIcon,
    hideTaskbarEntry,
    title: processTitle,
  } = process || {};
  const resetFaviconAndTitle = useCallback((): void => {
    setTitle(alias);
    // Clear the favIcon state completely to let document favicon take over
    setFavIcon("");
  }, []);
  const currentFavIcon = useMemo(
    () =>
      isDynamicIcon(favIcon)
        ? imageSrc(favIcon, 16, getDpi(), getExtension(favIcon)).split(" ")[0]
        : favIcon,
    [favIcon]
  );
  const favIconMimeType = useMemo(
    () => getMimeType(currentFavIcon),
    [currentFavIcon]
  );
  const getCursor = useCallback(
    async (path: string) => {
      const imageBuffer = await readFile(path);

      if (!imageBuffer?.length) return "";

      const { cursorToCss } = await import("utils/imageDecoder");

      return cursorToCss(imageBuffer, path);
    },
    [readFile]
  );

  useEffect(() => {
    if (!hideTaskbarEntry && (processIcon || processTitle)) {
      const documentTitle = processTitle ? `${processTitle} - ${alias}` : alias;

      if (title !== documentTitle) setTitle(documentTitle);
      // Only set a favicon from process if it's a dynamic app icon
      if (
        processIcon &&
        isDynamicIcon(processIcon) &&
        favIcon !== processIcon
      ) {
        setFavIcon(encodeURI(processIcon));
      }
    } else {
      resetFaviconAndTitle();
    }
  }, [
    favIcon,
    hideTaskbarEntry,
    processIcon,
    processTitle,
    resetFaviconAndTitle,
    title,
  ]);

  useEffect(() => {
    const onVisibilityChange = (): void => {
      if (document.visibilityState === "visible") resetFaviconAndTitle();
    };
    const onBeforeUnload = (): void => {
      // Empty function to avoid conflicts with document-level icons
    };

    window.addEventListener(
      "beforeunload",
      onBeforeUnload,
      ONE_TIME_PASSIVE_EVENT
    );
    document.addEventListener("visibilitychange", onVisibilityChange, {
      passive: true,
    });

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [resetFaviconAndTitle]);

  useEffect(() => {
    if (cursor) getCursor(cursor).then(setCustomCursor);
  }, [cursor, getCursor]);

  // Detect if the device is mobile
  const isMobileDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  return (
    <Head>
      <title>{title}</title>
      {/* Dynamic app-specific favicon */}
      {currentFavIcon && (
        <link href={currentFavIcon} rel="icon" type={favIconMimeType} />
      )}

      {/* Always provide these for iOS */}
      <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      {/* eslint-disable react/no-invalid-html-attribute */}
      <link
        href="/apple-touch-icon-precomposed.png"
        rel="apple-touch-icon-precomposed"
      />
      {/* eslint-enable react/no-invalid-html-attribute */}

      {/* Mobile-specific override as a forced fallback */}
      {isMobileDevice && (
        <>
          <link
            href="/apple-touch-icon.png"
            rel="shortcut icon"
            type="image/png"
          />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="yes" name="mobile-web-app-capable" />
        </>
      )}

      <meta
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, interactive-widget=resizes-content, viewport-fit=cover"
        name="viewport"
      />
      <meta content={description} name="description" />
      <meta content={alias} property="og:title" />
      <meta content="website" property="og:type" />
      <meta content={author.url} property="og:url" />
      <meta
        content="https://github.com/NYTEMODEONLY/nytemode-os/raw/main/screenshot.png"
        property="og:image"
      />
      <meta content={description} property="og:description" />
      <link
        href="https://github.com/NYTEMODEONLY/nytemode-os/rss.xml"
        rel="alternate"
        title={`RSS Feed for ${alias}`}
        type="application/rss+xml"
      />
      {desktopIcons.map((icon) => {
        const isSubIcon = icon.includes("/16x16/");
        const dynamicIcon = !isSubIcon && isDynamicIcon(icon);
        const extension = getExtension(icon);

        return (
          <link
            key={icon}
            as="image"
            href={dynamicIcon || isSubIcon ? undefined : icon}
            imageSrcSet={
              dynamicIcon
                ? imageSrcs(icon, 48, extension)
                : isSubIcon
                  ? imageSrcs(icon.replace("16x16/", ""), 16, extension)
                  : undefined
            }
            rel="preload"
            type={getMimeType(extension)}
            {...HIGH_PRIORITY_ELEMENT}
          />
        );
      })}
      {customCursor && <style>{customCursor}</style>}

      {/* Mobile-specific icon injection via CSS */}
      {isMobileDevice && (
        <style>{`
          head::after {
            content: url(/apple-touch-icon.png);
            display: none;
          }
        `}</style>
      )}
    </Head>
  );
};

export default memo(Metadata);
