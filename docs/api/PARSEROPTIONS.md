# Parser Options

<table>
  <thead>
    <th>Name</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td><b>dom</b></td>
      <td><b>boolean</b></td>
      <td><code>false</code></td>
      <td><code>vue-di-loader</code> uses regular expressions to search the contents of the <code><template></code> tag for SFC references.
      If this option is enabled, then <code>vue-di-loader</code> will us <a href="https://www.npmjs.com/package/xmldom">xmldom</a>
      to parse the contents of<code><template></code> and search for SFC references.</td>
    </tr>
  </tbody>
</table>

<br/>
