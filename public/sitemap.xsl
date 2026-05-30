<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Sea Society Ibiza — XML Sitemap</title>
        <style>
          :root {
            color-scheme: light;
            --fg: #1c1b1b;
            --muted: #6e7979;
            --line: #e5e2e1;
            --bg: #fcf9f8;
            --primary: #055043;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--fg);
            font: 14px/1.5 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          header {
            padding: 28px 32px 18px;
            border-bottom: 1px solid var(--line);
            background: #fff;
          }
          h1 {
            margin: 0 0 6px;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.01em;
          }
          .lede {
            margin: 0;
            color: var(--muted);
            font-size: 13px;
          }
          .lede a { color: var(--primary); text-decoration: none; }
          .lede a:hover { text-decoration: underline; }
          .stats {
            display: inline-block;
            margin-left: 12px;
            padding: 2px 8px;
            background: var(--bg);
            border: 1px solid var(--line);
            border-radius: 999px;
            color: var(--fg);
            font-size: 12px;
          }
          main { padding: 24px 32px 64px; }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid var(--line);
            vertical-align: top;
          }
          tr:last-child td { border-bottom: none; }
          th {
            background: #f6f3f2;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--muted);
            font-weight: 600;
          }
          td.url { word-break: break-all; }
          td.url a { color: var(--primary); text-decoration: none; }
          td.url a:hover { text-decoration: underline; }
          td.meta, td.priority { color: var(--muted); font-size: 13px; white-space: nowrap; }
          td.alts { font-size: 12px; color: var(--muted); }
          td.alts span { display: inline-block; margin-right: 8px; }
        </style>
      </head>
      <body>
        <header>
          <h1>
            XML Sitemap
            <span class="stats"><xsl:value-of select="count(sm:urlset/sm:url)" /> URLs</span>
          </h1>
          <p class="lede">
            This sitemap lists every public page on
            <a href="https://www.seasocietyibiza.com/">seasocietyibiza.com</a>.
            Generated for search engine crawlers; rendered with a stylesheet for humans.
          </p>
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last modified</th>
                <th>Frequency</th>
                <th>Priority</th>
                <th>Alternates</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sm:urlset/sm:url">
                <tr>
                  <td class="url">
                    <a href="{sm:loc}">
                      <xsl:value-of select="sm:loc" />
                    </a>
                  </td>
                  <td class="meta">
                    <xsl:value-of select="substring(sm:lastmod, 1, 10)" />
                  </td>
                  <td class="meta">
                    <xsl:value-of select="sm:changefreq" />
                  </td>
                  <td class="priority">
                    <xsl:value-of select="sm:priority" />
                  </td>
                  <td class="alts">
                    <xsl:for-each select="xhtml:link">
                      <span><xsl:value-of select="@hreflang" /></span>
                    </xsl:for-each>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
