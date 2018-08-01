const React = require('react')
const PropTypes = require('prop-types')

class Optimistic extends React.Component {
  constructor(props) {
    super(props)
    this.state = { state: Optimistic.START_STATE }
  }

  componentWillUnmount() {
    if (this.promise) this.promise.cancelled = true
  }

  render() {
    return this.props.children({
      state: this.state.state,
      reset: () => {
        this.promise.cancelled = true
        this.setState({ state: Optimistic.START_STATE })
      },
      updater: (action) =>
        (...args) => {
          this.setState({
            state: Optimistic.UPDATED_STATE,
          })
          this.promise = action(...args)

          return this.promise.catch(() => {
            if (this.promise.cancelled) return

            this.setState({
              state: Optimistic.FAILED_STATE
            })
          })
        }
    })
  }
}

Optimistic.propTypes = {
  children: PropTypes.func.isRequired,
}

Optimistic.START_STATE = 'start'
Optimistic.UPDATED_STATE = 'updated'
Optimistic.FAILED_STATE = 'failed'

module.exports = Optimistic