

export default class AboutCommon {
    constructor(props, updateState) {
        super(props)
        this.props = props
        this.updateState = updateState
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }

    componentDidMount() {
        this.backPress.componentDidMount()
    }

    componentWillUnmount() {
        this.backPress.componentWillUnMount()
        fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json').then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('network Error')
        }).then(data => {
            if (data) {
                this.updateState({ data })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    onBackPress() {
        NavigationUtil.goBack(this.props.navigation)
        return true
    }
}