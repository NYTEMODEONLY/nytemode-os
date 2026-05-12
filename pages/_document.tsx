import NextDocument, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";
import { DEFAULT_LOCALE } from "utils/constants";

const withStyledComponents = async (
  ctx: DocumentContext
): Promise<DocumentInitialProps> => {
  const { renderPage } = ctx;
  const sheet = new ServerStyleSheet();

  try {
    ctx.renderPage = () =>
      renderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

    const { styles, ...initialProps } = await NextDocument.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [styles, sheet.getStyleElement()],
    };
  } finally {
    sheet.seal();
  }
};

class Document extends NextDocument {
  public static override async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return withStyledComponents(ctx);
  }

  public override render(): React.JSX.Element {
    return (
      <Html lang={DEFAULT_LOCALE}>
        <Head>
          {/* Basic Meta Tags */}
          <meta charSet="utf-8" />
          <meta content="#000000" name="theme-color" />

          {/* iOS specific meta tags */}
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta
            content="black-translucent"
            name="apple-mobile-web-app-status-bar-style"
          />
          <meta content="NYTEMODE OS" name="apple-mobile-web-app-title" />
          <meta content="telephone=no" name="format-detection" />
          <meta content="yes" name="mobile-web-app-capable" />

          {/* Standard favicons */}
          <link href="/favicon.ico" rel="icon" sizes="any" />
          <link
            href="/favicon-32x32.png"
            rel="icon"
            sizes="32x32"
            type="image/png"
          />
          <link
            href="/favicon-16x16.png"
            rel="icon"
            sizes="16x16"
            type="image/png"
          />

          {/* Apple Touch Icons - iOS strict order matters */}
          <link color="#000000" href="/favicon.ico" rel="mask-icon" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
          {/* eslint-disable react/no-invalid-html-attribute */}
          <link
            href="/apple-touch-icon-precomposed.png"
            rel="apple-touch-icon-precomposed"
          />
          {/* eslint-enable react/no-invalid-html-attribute */}
          <link
            href="/apple-touch-icon.png"
            rel="apple-touch-icon"
            sizes="180x180"
          />

          {/* PWA manifest */}
          <link href="/site.webmanifest" rel="manifest" />

          {/* CSS Fallback for icons - sometimes helps with stubborn mobile browsers */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @media screen and (max-width: 768px) {
              link[rel="icon"] {
                content: url(/apple-touch-icon.png);
              }

              /* Safari-specific fallback */
              @supports (-webkit-touch-callout: none) {
                head::before {
                  content: url(/apple-touch-icon.png);
                  position: absolute;
                  width: 0;
                  height: 0;
                  overflow: hidden;
                }
              }
            }
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
