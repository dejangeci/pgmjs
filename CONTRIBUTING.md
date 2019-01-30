# Contributing

1. [Fork it](https://help.github.com/articles/fork-a-repo/)
2. Install dependencies (`npm install`)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Added some feature'`)
5. Test your changes (`npm test`)
6. Push to the branch (`git push origin my-new-feature`)
7. [Create new Pull Request](https://help.github.com/articles/creating-a-pull-request/)

## Recommended tools

- [Visual Studio Code 1.30.2+](https://code.visualstudio.com/)
- VSCode Extensions:
  - Prettier - Code Formatter
  - ESLint
  - EditorConfig for VS Code
  - Coverage Gutters

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
