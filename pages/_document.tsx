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
          <meta name="theme-color" content="#000000" />

          {/* Viewport - crucial for mobile */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
          />

          {/* iOS specific meta tags */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="apple-mobile-web-app-title" content="NYTEMODE OS" />
          <meta name="format-detection" content="telephone=no" />

          {/* Standard favicons */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />

          {/* Apple Touch Icons - iOS strict order matters */}
          <link rel="mask-icon" href="/favicon.ico" color="#000000" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link
            rel="apple-touch-icon-precomposed"
            href="/apple-touch-icon-precomposed.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />

          {/* PWA manifest */}
          <link rel="manifest" href="/site.webmanifest" />

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
