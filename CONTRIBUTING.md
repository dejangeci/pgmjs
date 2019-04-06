# Contributing

1. [Fork it](https://help.github.com/articles/fork-a-repo/)
2. Install dependencies (`npm install`)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes - follow [commitizen](https://github.com/commitizen/cz-cli) convention (`git commit -am 'feat(cli): added some feature'`)
5. Lint and test your changes (`npm run lint && npm test`)
6. Push to the branch (`git push origin my-new-feature`)
7. [Create new Pull Request](https://help.github.com/articles/creating-a-pull-request/)

## Recommended tools

- [Visual Studio Code 1.33.0+](https://code.visualstudio.com/)
- VSCode Extensions:
  - Prettier - Code Formatter
  - ESLint
  - EditorConfig for VS Code
  - Coverage Gutters
  - Visual Studio Code Commitizen Support

## Testing

Use [Jest](https://jestjs.io) to write tests. Run the test suite with this command:

```
npm test
```

### Coverage

Generate test coverage report with this command:

```
npm run test:cov
```

[Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters) VSCode extension uses coverage report to display code coverage directly in the editor.

## Code Style

Use [Prettier](https://prettier.io/) and [EditorConfig](http://editorconfig.org) to maintain code style and best practices. Please make sure your PR adheres to the guides by running:

```
npm run lint
```
