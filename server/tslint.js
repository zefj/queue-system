module.exports = {
    defaultSeverity: "error",
    extends: [
        "tslint-config-airbnb"
    ],
    jsRules: {},
    rules: {
        'ter-indent': [
            true,
            4
        ],
        'max-line-length': [
            true,
            {
                "limit": 120,
                "ignore-pattern": "throw new (.*?);$"
            }
        ]
    },
    rulesDirectory: []
};




