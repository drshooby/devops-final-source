module.exports = {
    branches: ['main'],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/github',
        {
          assets: [
            { path: 'VERSION.txt', label: 'Version TXT' },
          ],
          failComment: false,  // Disable creation of failure comments
          failTitle: false,    // Disable creation of failure PRs
          labels: undefined,   // Don't add labels to issues
          addReleases: 'bottom',
        },
      ],
      [
        '@semantic-release/exec',
        {
          prepareCmd: "echo '${nextRelease.version}-${process.env.ENVIRONMENT}' > VERSION.txt",
        },
      ],
      [
        '@semantic-release/git',
        {
          assets: ['VERSION.txt', 'package.json'],
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        },
      ],
    ],
  };