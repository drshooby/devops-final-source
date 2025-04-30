// release.config.js
module.exports = {
    branches: ['main'],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/npm',
        {
          npmPublish: false,
        },
      ],
      [
        '@semantic-release/github',
        {
          assets: [
            { path: 'version.json', label: 'Version JSON' },
          ],
        },
      ],
      [
        '@semantic-release/exec',
        {
          // Create a version.json file containing version info and environment
          prepareCmd: 'node -e "const fs=require(\'fs\'); fs.writeFileSync(\'version.json\', JSON.stringify({version: \'${nextRelease.version}-${process.env.ENVIRONMENT}\', environment: \'${process.env.ENVIRONMENT}\', releaseDate: new Date().toISOString()}, null, 2))"',
        },
      ],
      [
        '@semantic-release/git',
        {
          assets: ['version.json', 'package.json'],
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        },
      ],
    ],
  };