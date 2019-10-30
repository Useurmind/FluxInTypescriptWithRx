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
            },
            {
                type    : 'confirm',
                name    : 'includeInternationalization',
                message : 'Do you want to include internationalization support?',
            },
            {
                type    : 'confirm',
                name    : 'includeTheming',
                message : 'Do you want to include theming support?',
            }
        ]);
    }
    
    writing() {
        this._copyFile('.vscode/tasks.json');
        this.log("The provided tasks use the problem matchers from the extension https://marketplace.visualstudio.com/items?itemName=eamodio.tsl-problem-matcher");
        this._copyFile('webpack.config.js');
        this._copyFile('webpack.debug.js');
        this._copyFile('webpack.release.js');
        this._copyFile('tslint.json');
        this._copyFile('tsconfig.json');
        this._copyFile('package.json');
        this._copyFile('karma.conf.js');
        this._copyFile('spec/TestSpec.ts');
        this._copyFile('src/App.tsx');
        this._copyFile('src/GlobalContainerFactory.ts');
        this._copyFile('src/index.tsx');
        this._copyFile('src/Master.tsx');
        this._copyFile('src/pages/home/ContainerFactory.ts');
        this._copyFile('src/pages/home/HomePage.tsx');
        this._copyFile('src/pages/home/SiteMapNode.tsx');

        if(this.answers.includeInternationalization)
        {
            this._copyFile('src/i18n/LanguageChooser.tsx');
            this._copyFile('src/i18n/Languages.ts');
            this._copyFile('src/i18n/Resources.en.ts');
            this._copyFile('src/i18n/Resources.de.ts');
        }

        if(this.answers.includeTheming)
        {
            this._copyFile('src/theming/Theme.ts');
        }
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
        this.npmInstall(["react", "react-dom"], { "save": true });
        this.npmInstall(["@types/react", "@types/react-dom"], { "save-dev": true });

        // rxjs
        this.npmInstall(["rxjs", "rxjs-compat"], { "save": true });

        // rfluxx
        this.npmInstall(["rfluxx", "rfluxx-react", "rfluxx-routing"], { "save": true });
        if(this.answers.includeInternationalization)
        {
            this.npmInstall("rfluxx-i18n", { "save": true });
        }
        if(this.answers.includeTheming)
        {
            this.npmInstall("rfluxx-mui-theming", { "save": true });
        }

        // material-ui
        this.npmInstall(["@material-ui/core", "@material-ui/icons", "@material-ui/styles"], { "save": true });
        this.npmInstall("classnames", { "save": true });
        this.npmInstall("@types/classnames", { "save-dev": true });

        // webpack and build stuff
        this.npmInstall([
            "webpack",
            "webpack-merge",
            "webpack-cli",
            "webpack-dev-server",
            "clean-webpack-plugin",
            "html-webpack-plugin",
            "html-webpack-root-plugin",
            "uglifyjs-webpack-plugin",
            "ts-loader",
            "fork-ts-checker-webpack-plugin"
        ], { "save-dev": true });

        // typescript and linting
        this.npmInstall("tslib", { "save": true });
        this.npmInstall(["typescript", "tslint", "tslint-eslint-rules" ], { "save-dev": true });

        // karma and testing
        this.npmInstall(["jasmine-core", "jasmine", "@types/jasmine"], { "save-dev": true });
        this.npmInstall(["karma", "karma-chrome-launcher", "karma-jasmine", "karma-spec-reporter", "karma-webpack"], { "save-dev": true });
    }    
};