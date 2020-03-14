/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /deni-react-treeview/,
              use: loaders.null(),
            },
            {
                test: /react-ace/,
                use: loaders.null(),
            },
            {
                test: /ace-builds/,
                use: loaders.null(),
            },
          ],
        },
      })
    }
  }