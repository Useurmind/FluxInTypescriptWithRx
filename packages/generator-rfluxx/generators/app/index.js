var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type    : 'input',
                name    : 'name',
                message : 'Your projects technical name',
            },
            {
                type    : 'input',
                name    : 'title',
                message : 'Your projects title',
            }
        ]);
    }
    
    writing() {
        this._copyFile('webpack.config.js');
        this._copyFile('webpack.release.js');
        this._copyFile('tslint.json');
        this._copyFile('tsconfig.json');
        this._copyFile('package.json');
        this._copyFile('karma.conf.js');
        this._copyFile('spec/TestSpec.ts');
        this._copyFile('src/App.tsx');
        this._copyFile('src/GlobalContainerFactory.ts');
        this._copyFile('src/HomePage.tsx');
        this._copyFile('src/index.tsx');
        this._copyFile('src/Master.tsx');
    }

    _copyFile(filePath)  {
        this.fs.copyTpl(
            this.templatePath(filePath),
            this.destinationPath(filePath),
            this.answers
        );
    }

    install() {
        this.log('installing project dependencies');

        // react
        this.npmInstall("react", { "save": true });
        this.npmInstall("react-dom", { "save": true });
        this.npmInstall("@types/react", { "save-dev": true });
        this.npmInstall("@types/react-dom", { "save-dev": true });

        // rxjs
        this.npmInstall("rxjs", { "save": true });
        this.npmInstall("rxjs-compat", { "save": true });

        // rfluxx
        this.npmInstall("rfluxx", { "save": true });
        this.npmInstall("rfluxx-routing", { "save": true });

        // material-ui
        this.npmInstall("@material-ui/core", { "save": true });
        this.npmInstall("@material-ui/icons", { "save": true });
        this.npmInstall("@material-ui/styles", { "save": true });
        this.npmInstall("classnames", { "save": true });
        this.npmInstall("@types/classnames", { "save-dev": true });

        // webpack and build stuff
        this.npmInstall("webpack", { "save-dev": true });
        this.npmInstall("webpack-merge", { "save-dev": true });
        this.npmInstall("webpack-cli", { "save-dev": true });
        this.npmInstall("webpack-dev-server", { "save-dev": true });
        this.npmInstall("clean-webpack-plugin", { "save-dev": true });
        this.npmInstall("html-webpack-plugin", { "save-dev": true });
        this.npmInstall("html-webpack-root-plugin", { "save-dev": true });
        this.npmInstall("uglifyjs-webpack-plugin", { "save-dev": true });
        this.npmInstall("style-loader", { "save-dev": true });
        this.npmInstall("ts-loader", { "save-dev": true });

        // typescript and linting
        this.npmInstall("tslib", { "save": true });
        this.npmInstall("typescript", { "save-dev": true });
        this.npmInstall("tslint", { "save-dev": true });
        this.npmInstall("tslint-eslint-rules", { "save-dev": true });

        // karma and testing
        this.npmInstall("jasmine-core", { "save-dev": true });
        this.npmInstall("jasmine", { "save-dev": true });
        this.npmInstall("@types/jasmine", { "save-dev": true });
        this.npmInstall("karma", { "save-dev": true });
        this.npmInstall("karma-chrome-launcher", { "save-dev": true });
        this.npmInstall("karma-jasmine", { "save-dev": true });
        this.npmInstall("karma-spec-reporter", { "save-dev": true });
        this.npmInstall("karma-webpack", { "save-dev": true });
    }    
};