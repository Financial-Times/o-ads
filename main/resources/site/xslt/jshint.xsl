<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<xsl:stylesheet	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" indent="yes"/>
<xsl:decimal-format decimal-separator="." grouping-separator="," />

<xsl:key name="files" match="file" use="@name" />

<xsl:template match="//lint">
  <html>
    <head>
      <link href="../css/bootstrap.min.css" rel="stylesheet" />
      <link href="../css/jshint.css" rel="stylesheet" />
    </head>
    <body>
      <h1>JSHint Report</h1>
      <xsl:variable name="fileCount" select="count(file[@name and generate-id(.) = generate-id(key('files', @name))])" />
      <xsl:choose>
        <xsl:when test="$fileCount > 0">
          <!-- Summary part -->
          <xsl:apply-templates select="." mode="summary" />

          <!-- File List part -->
          <xsl:apply-templates select="." mode="filelist" />

          <!-- For each file create its part -->
          <xsl:apply-templates select="file[@name and generate-id(.) = generate-id(key('files', @name))]" />
        </xsl:when>
        <xsl:otherwise>
          <div class="alert-message success">
            <p>Good job! <span class="logo">JSHint</span> hasn't found any problems with
          your code.</p>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </body>
  </html>
</xsl:template>

  <xsl:template match="lint" mode="summary">
    <h2 class="summary">
      <xsl:variable name="fileCount" select="count(file[@name and generate-id(.) = generate-id(key('files', @name))])" />
      <xsl:variable name="errorCount" select="count(file/issue)" />
      <xsl:value-of select="$fileCount" />
      file(s) analyzed;
      <span id="errors"><xsl:value-of select="$errorCount" /></span>
      issue(s) found.</h2>
  </xsl:template>

  <xsl:template match="lint" mode="filelist">
    <h3>Files</h3>
    <table class="table files">
      <thead>
        <tr>
          <th>Name</th>
          <th>Issues</th>
        </tr>
      </thead>
      <tbody>
      <xsl:for-each select="file[@name and generate-id(.) = generate-id(key('files', @name))]">
        <xsl:sort data-type="number" order="descending" select="count(key('files', @name)/issue)" />
        <xsl:variable name="currentName" select="@name" />
        <xsl:variable name="errorCount" select="count(../file[@name=$currentName]/issue)" />
        <tr>
          <xsl:call-template name="alternated-row" />
          <td>
            <xsl:if test="$errorCount = 0">
              <xsl:value-of select="@name" />
            </xsl:if>
            <xsl:if test="$errorCount &gt; 0">
              <a>
                <xsl:attribute name="href"><xsl:value-of select="concat('#f-', translate(@name, '\', '/'))"></xsl:value-of></xsl:attribute>
                <xsl:value-of select="@name" />
              </a>
            </xsl:if>
          </td>
          <td>
            <xsl:value-of select="$errorCount" />
          </td>
        </tr>
      </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>

  <xsl:template match="file">
    <xsl:variable name="errorCount" select="count(./issue)" />
    <xsl:if test="$errorCount > 0">
      <a>
        <xsl:attribute name="name"><xsl:value-of select="concat('f-', translate(@name, '\', '/'))"></xsl:value-of></xsl:attribute>
      </a>
      <h3>
        File
        <xsl:value-of select="@name" />
      </h3>

      <ul class="jshint-errors">
        <xsl:variable name='filename' select='@name' />
        <xsl:for-each select="key('files', @name)/issue">
          <xsl:value-of select="@name" />
          <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="concat('code-view.html?file=', translate($filename, '\', '/'), '&amp;line=', @line, '&amp;reason=', @reason)"></xsl:value-of></xsl:attribute>
                Line <xsl:value-of select="@line" /> Char <xsl:value-of select="@char" />:</a>
              <code>
                <xsl:value-of select="@evidence" />
              </code>
              <p><xsl:value-of select="@reason" /></p>
          </li>
        </xsl:for-each>
      </ul>
      <a href="#top">Back to top</a>
    </xsl:if>
  </xsl:template>

  <xsl:template name="alternated-row">
    <xsl:attribute name="class">
      <xsl:if test="position() mod 2 = 1">a</xsl:if>
      <xsl:if test="position() mod 2 = 0">b</xsl:if>
    </xsl:attribute>
  </xsl:template>
</xsl:stylesheet>

